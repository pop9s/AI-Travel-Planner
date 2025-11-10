/**
 * 语音识别工具
 * 使用 Web Speech API 实现语音输入
 */

import { Language } from './languageDetection'

// Web Speech API 类型声明
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event) => void) | null
  onend: (() => void) | null
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition
  new (): SpeechRecognition
}

// 检查浏览器是否支持语音识别
export function isSpeechRecognitionSupported(): boolean {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
}

// 语言代码映射到语音识别语言代码
const speechLanguageMap: Record<Language, string> = {
  zh: 'zh-CN',      // 中文（简体）
  en: 'en-US',      // 英文（美国）
  ja: 'ja-JP',      // 日文
  ko: 'ko-KR',      // 韩文
  auto: 'zh-CN',    // 默认中文
}

export function getSpeechRecognitionLanguage(language: Language): string {
  return speechLanguageMap[language] || 'zh-CN'
}

export interface SpeechRecognitionOptions {
  language: Language
  continuous?: boolean
  interimResults?: boolean
  maxAlternatives?: number
}

export interface SpeechRecognitionResultData {
  transcript: string
  confidence: number
  isFinal: boolean
}

export type SpeechRecognitionCallback = (result: SpeechRecognitionResultData) => void
export type SpeechRecognitionErrorCallback = (error: string) => void

/**
 * 创建语音识别实例
 */
export function createSpeechRecognition(
  options: SpeechRecognitionOptions,
  onResult: SpeechRecognitionCallback,
  onError: SpeechRecognitionErrorCallback
): SpeechRecognition | null {
  if (!isSpeechRecognitionSupported()) {
    onError('您的浏览器不支持语音识别功能')
    return null
  }

  const SpeechRecognitionConstructor =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

  const recognition = new SpeechRecognitionConstructor()

  // 设置语言
  recognition.lang = getSpeechRecognitionLanguage(options.language)

  // 设置选项
  recognition.continuous = options.continuous ?? false
  recognition.interimResults = options.interimResults ?? true
  recognition.maxAlternatives = options.maxAlternatives ?? 1

  // 监听结果
  recognition.onresult = (event: any) => {
    const results = event.results
    const lastResult = results[results.length - 1]
    const transcript = lastResult[0].transcript
    const confidence = lastResult[0].confidence
    const isFinal = lastResult.isFinal

    onResult({
      transcript: transcript.trim(),
      confidence,
      isFinal,
    })
  }

  // 监听错误
  recognition.onerror = (event: any) => {
    let errorMessage = '语音识别出错'
    
    switch (event.error) {
      case 'no-speech':
        errorMessage = '未检测到语音，请重试'
        break
      case 'audio-capture':
        errorMessage = '无法访问麦克风'
        break
      case 'not-allowed':
        errorMessage = '麦克风权限被拒绝'
        break
      case 'network':
        errorMessage = '网络错误'
        break
      case 'aborted':
        errorMessage = '语音识别已取消'
        break
      default:
        errorMessage = `语音识别错误: ${event.error}`
    }

    onError(errorMessage)
  }

  // 监听结束
  recognition.onend = () => {
    console.log('语音识别结束')
  }

  return recognition
}

/**
 * 语音识别管理器
 */
export class SpeechRecognitionManager {
  private recognition: SpeechRecognition | null = null
  private isListening = false
  private currentLanguage: Language = 'zh'

  constructor(
    private onResult: SpeechRecognitionCallback,
    private onError: SpeechRecognitionErrorCallback,
    private onStatusChange?: (isListening: boolean) => void
  ) {}

  /**
   * 开始录音
   */
  start(language: Language = 'zh'): boolean {
    if (!isSpeechRecognitionSupported()) {
      this.onError('您的浏览器不支持语音识别')
      return false
    }

    if (this.isListening) {
      return false
    }

    this.currentLanguage = language

    // 创建新的识别实例
    this.recognition = createSpeechRecognition(
      {
        language,
        continuous: false,
        interimResults: true,
      },
      this.onResult,
      (error) => {
        this.stop()
        this.onError(error)
      }
    )

    if (!this.recognition) {
      return false
    }

    try {
      this.recognition.start()
      this.isListening = true
      this.onStatusChange?.(true)
      return true
    } catch (error) {
      this.onError('无法启动语音识别')
      return false
    }
  }

  /**
   * 停止录音
   */
  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop()
      } catch (error) {
        console.error('停止语音识别失败:', error)
      }
    }

    this.isListening = false
    this.onStatusChange?.(false)
  }

  /**
   * 获取当前状态
   */
  getIsListening(): boolean {
    return this.isListening
  }

  /**
   * 获取当前语言
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage
  }

  /**
   * 销毁管理器
   */
  destroy() {
    this.stop()
    this.recognition = null
  }
}

/**
 * 获取语音识别的语言名称
 */
export function getSpeechLanguageName(language: Language): string {
  const names: Record<Language, string> = {
    zh: '中文',
    en: 'English',
    ja: '日本語',
    ko: '한국어',
    auto: '自动',
  }
  return names[language] || '中文'
}

