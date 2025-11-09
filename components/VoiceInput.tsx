'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react'
import { Language } from '@/lib/languageDetection'
import {
  isSpeechRecognitionSupported,
  SpeechRecognitionManager,
  getSpeechLanguageName,
} from '@/lib/speechRecognition'
import {
  isIFlytekConfigured,
  getIFlytekConfig,
  IFlytekSpeechRecognition,
} from '@/lib/iflytekSpeech'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  language: Language
  disabled?: boolean
  fieldName?: string
}

export default function VoiceInput({
  onTranscript,
  language,
  disabled = false,
  fieldName = '输入',
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [error, setError] = useState<string>('')
  const [interimText, setInterimText] = useState('')
  const [useIflytek, setUseIflytek] = useState(false)
  const managerRef = useRef<SpeechRecognitionManager | null>(null)
  const iflytekRef = useRef<IFlytekSpeechRecognition | null>(null)

  // 检查语音识别支持
  useEffect(() => {
    const iflytekConfigured = isIFlytekConfigured()
    const browserSupported = isSpeechRecognitionSupported()
    
    setUseIflytek(iflytekConfigured)
    setIsSupported(iflytekConfigured || browserSupported)
  }, [])

  // 初始化语音识别管理器
  useEffect(() => {
    if (!isSupported) return

    if (useIflytek) {
      // 使用科大讯飞
      const config = getIFlytekConfig()
      if (config) {
        iflytekRef.current = new IFlytekSpeechRecognition(
          config,
          (result) => {
            if (result.isFinal) {
              onTranscript(result.text)
              setInterimText('')
              setIsListening(false)
            } else {
              setInterimText(result.text)
            }
          },
          (errorMsg) => {
            setError(errorMsg)
            setIsListening(false)
            setTimeout(() => setError(''), 3000)
          },
          (status) => {
            setIsListening(status === 'recording')
          }
        )
      }
    } else {
      // 使用浏览器原生
      managerRef.current = new SpeechRecognitionManager(
        (result) => {
          if (result.isFinal) {
            onTranscript(result.transcript)
            setInterimText('')
            setIsListening(false)
          } else {
            setInterimText(result.transcript)
          }
        },
        (errorMsg) => {
          setError(errorMsg)
          setIsListening(false)
          setTimeout(() => setError(''), 3000)
        },
        (status) => {
          setIsListening(status)
        }
      )
    }

    return () => {
      managerRef.current?.destroy()
      iflytekRef.current?.destroy()
    }
  }, [isSupported, useIflytek, onTranscript])

  const handleToggleListening = async () => {
    if (isListening) {
      // 停止录音
      if (useIflytek) {
        iflytekRef.current?.stop()
      } else {
        managerRef.current?.stop()
      }
    } else {
      // 开始录音
      setError('')
      setInterimText('')
      
      if (useIflytek) {
        const started = await iflytekRef.current?.start(language === 'auto' ? 'zh' : language)
        if (!started) {
          setError('无法启动语音识别')
        }
      } else {
        const started = managerRef.current?.start(language === 'auto' ? 'zh' : language)
        if (!started) {
          setError('无法启动语音识别')
        }
      }
    }
  }

  if (!isSupported) {
    return null // 不支持时不显示按钮
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggleListening}
        disabled={disabled || isListening}
        className={`
          relative p-2 rounded-lg transition-all duration-200
          ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : useIflytek
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
        `}
        title={
          isListening
            ? '正在录音...'
            : useIflytek
            ? `科大讯飞语音输入${fieldName}`
            : `语音输入${fieldName}`
        }
      >
        {isListening ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
        {useIflytek && !isListening && (
          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300" />
        )}
      </button>

      {/* 录音状态提示 */}
      {isListening && (
        <div className="absolute top-full mt-2 left-0 bg-red-50 border border-red-200 rounded-lg px-3 py-2 shadow-lg z-10 min-w-[200px]">
          <div className="flex items-center gap-2 text-sm text-red-700">
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-red-500 animate-pulse"></div>
              <div className="w-1 h-4 bg-red-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-4 bg-red-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="font-medium">正在录音...</span>
          </div>
          {interimText && (
            <p className="text-xs text-gray-600 mt-1 italic">"{interimText}"</p>
          )}
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">
              语言: {getSpeechLanguageName(language === 'auto' ? 'zh' : language)}
            </p>
            {useIflytek && (
              <span className="text-xs text-purple-600 font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                讯飞
              </span>
            )}
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="absolute top-full mt-2 left-0 bg-red-50 border border-red-200 rounded-lg px-3 py-2 shadow-lg z-10 min-w-[200px]">
          <div className="flex items-center gap-2 text-sm text-red-700">
            <MicOff className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  )
}

