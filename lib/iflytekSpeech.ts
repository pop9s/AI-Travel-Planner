/**
 * 科大讯飞语音识别 SDK
 * 使用 WebSocket 实时流式语音识别
 */

import { Language } from './languageDetection'
import CryptoJS from 'crypto-js'

// 科大讯飞语音识别配置
interface IFlytekConfig {
  appId: string
  apiKey: string
  apiSecret: string
}

// 语言代码映射
const iflytekLanguageMap: Record<Language, string> = {
  zh: 'zh_cn',      // 中文
  en: 'en_us',      // 英文
  ja: 'ja_jp',      // 日文
  ko: 'ko_kr',      // 韩文
  auto: 'zh_cn',    // 默认中文
}

// 识别结果
export interface IFlytekResult {
  text: string
  isFinal: boolean
  confidence?: number
}

// 回调函数类型
export type IFlytekResultCallback = (result: IFlytekResult) => void
export type IFlytekErrorCallback = (error: string) => void
export type IFlytekStatusCallback = (status: 'connecting' | 'recording' | 'stopped' | 'error') => void

/**
 * 获取 WebSocket 鉴权 URL
 */
function getWebSocketUrl(config: IFlytekConfig): string {
  const host = 'iat-api.xfyun.cn'
  const path = '/v2/iat'
  const date = new Date().toUTCString()

  // 构造签名原文
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`

  // 使用 hmac-sha256 进行加密
  const signature = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
  const signatureBase64 = CryptoJS.enc.Base64.stringify(signature)

  // 构造 authorization
  const authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureBase64}"`
  const authorization = btoa(authorizationOrigin)

  // 构造完整 URL
  const url = `wss://${host}${path}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`

  return url
}

/**
 * 科大讯飞语音识别管理器
 */
export class IFlytekSpeechRecognition {
  private ws: WebSocket | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioContext: AudioContext | null = null
  private isRecording = false
  private config: IFlytekConfig
  private language: Language = 'zh'
  private resultText = ''

  constructor(
    config: IFlytekConfig,
    private onResult: IFlytekResultCallback,
    private onError: IFlytekErrorCallback,
    private onStatusChange?: IFlytekStatusCallback
  ) {
    this.config = config
  }

  /**
   * 开始录音
   */
  async start(language: Language = 'zh'): Promise<boolean> {
    if (this.isRecording) {
      return false
    }

    this.language = language
    this.resultText = ''

    try {
      // 连接 WebSocket
      this.onStatusChange?.('connecting')
      await this.connectWebSocket()

      // 获取麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // 创建音频处理
      this.audioContext = new AudioContext({ sampleRate: 16000 })
      const source = this.audioContext.createMediaStreamSource(stream)
      
      // 创建 ScriptProcessor 处理音频数据
      const processor = this.audioContext.createScriptProcessor(4096, 1, 1)
      
      processor.onaudioprocess = (e) => {
        if (!this.isRecording) return
        
        const inputData = e.inputBuffer.getChannelData(0)
        const pcmData = this.convertToPCM(inputData)
        
        // 发送音频数据
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(
            JSON.stringify({
              data: {
                status: 1, // 1: 数据传输中
                format: 'audio/L16;rate=16000',
                encoding: 'raw',
                audio: btoa(String.fromCharCode(...pcmData)),
              },
            })
          )
        }
      }

      source.connect(processor)
      processor.connect(this.audioContext.destination)

      this.isRecording = true
      this.onStatusChange?.('recording')
      return true
    } catch (error) {
      this.onError('无法访问麦克风或连接失败')
      this.onStatusChange?.('error')
      return false
    }
  }

  /**
   * 停止录音
   */
  stop() {
    if (!this.isRecording) return

    this.isRecording = false

    // 发送结束标识
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          data: {
            status: 2, // 2: 数据传输结束
            format: 'audio/L16;rate=16000',
            encoding: 'raw',
            audio: '',
          },
        })
      )
    }

    // 关闭音频处理
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }

    this.onStatusChange?.('stopped')
  }

  /**
   * 连接 WebSocket
   */
  private async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      const url = getWebSocketUrl(this.config)
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        // 发送参数
        const params = {
          common: {
            app_id: this.config.appId,
          },
          business: {
            language: iflytekLanguageMap[this.language] || 'zh_cn',
            domain: 'iat',
            accent: 'mandarin', // 中文方言: mandarin(普通话)
            vad_eos: 2000,      // 静音检测时长
            dwa: 'wpgs',        // 动态修正
          },
          data: {
            status: 0, // 0: 首次传输
            format: 'audio/L16;rate=16000',
            encoding: 'raw',
          },
        }

        this.ws?.send(JSON.stringify(params))
        resolve()
      }

      this.ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data)
          
          if (response.code !== 0) {
            this.onError(`识别错误: ${response.message}`)
            return
          }

          if (response.data && response.data.result) {
            const result = response.data.result
            const ws = result.ws

            // 拼接识别文本
            let text = ''
            ws.forEach((item: any) => {
              item.cw.forEach((word: any) => {
                text += word.w
              })
            })

            this.resultText += text

            // 返回结果
            this.onResult({
              text: this.resultText,
              isFinal: response.data.status === 2,
              confidence: result.confidence,
            })
          }
        } catch (error) {
          this.onError('解析识别结果失败')
        }
      }

      this.ws.onerror = () => {
        this.onError('WebSocket 连接错误')
        this.onStatusChange?.('error')
        reject(new Error('WebSocket connection failed'))
      }

      this.ws.onclose = () => {
        console.log('WebSocket 连接关闭')
      }
    })
  }

  /**
   * 转换为 PCM 格式
   */
  private convertToPCM(inputData: Float32Array): Uint8Array {
    const output = new Int16Array(inputData.length)
    for (let i = 0; i < inputData.length; i++) {
      const s = Math.max(-1, Math.min(1, inputData[i]))
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff
    }
    return new Uint8Array(output.buffer)
  }

  /**
   * 销毁实例
   */
  destroy() {
    this.stop()
    
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }

  /**
   * 获取当前状态
   */
  getIsRecording(): boolean {
    return this.isRecording
  }
}

/**
 * 检查是否配置了科大讯飞
 */
export function isIFlytekConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_IFLYTEK_APP_ID &&
    process.env.NEXT_PUBLIC_IFLYTEK_API_KEY &&
    process.env.NEXT_PUBLIC_IFLYTEK_API_SECRET
  )
}

/**
 * 获取科大讯飞配置
 */
export function getIFlytekConfig(): IFlytekConfig | null {
  const appId = process.env.NEXT_PUBLIC_IFLYTEK_APP_ID
  const apiKey = process.env.NEXT_PUBLIC_IFLYTEK_API_KEY
  const apiSecret = process.env.NEXT_PUBLIC_IFLYTEK_API_SECRET

  if (!appId || !apiKey || !apiSecret) {
    return null
  }

  return {
    appId,
    apiKey,
    apiSecret,
  }
}

