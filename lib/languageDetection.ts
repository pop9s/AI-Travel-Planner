/**
 * 语言检测工具
 * 支持自动检测中文、英文、日文、韩文等
 */

export type Language = 'zh' | 'en' | 'ja' | 'ko' | 'auto'

export interface LanguageConfig {
  code: Language
  name: string
  nativeName: string
}

export const supportedLanguages: LanguageConfig[] = [
  { code: 'auto', name: 'Auto Detect', nativeName: '自动检测' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
]

/**
 * 检测文本的主要语言
 */
export function detectLanguage(text: string): Language {
  if (!text || text.trim().length === 0) {
    return 'en'
  }

  // 统计各种字符的数量
  const stats = {
    chinese: 0,
    english: 0,
    japanese: 0,
    korean: 0,
    total: 0,
  }

  for (const char of text) {
    const code = char.charCodeAt(0)
    stats.total++

    // 中文字符范围 (包含常用汉字)
    if (
      (code >= 0x4e00 && code <= 0x9fff) || // CJK统一汉字
      (code >= 0x3400 && code <= 0x4dbf) || // CJK扩展A
      (code >= 0xf900 && code <= 0xfaff) // CJK兼容汉字
    ) {
      stats.chinese++
    }
    // 日文假名
    else if (
      (code >= 0x3040 && code <= 0x309f) || // 平假名
      (code >= 0x30a0 && code <= 0x30ff) // 片假名
    ) {
      stats.japanese++
    }
    // 韩文
    else if (code >= 0xac00 && code <= 0xd7af) {
      stats.korean++
    }
    // 英文和数字
    else if ((code >= 0x0041 && code <= 0x005a) || (code >= 0x0061 && code <= 0x007a)) {
      stats.english++
    }
  }

  // 如果有效字符太少，默认返回英文
  if (stats.total < 3) {
    return 'en'
  }

  // 计算各语言占比
  const threshold = 0.3 // 30% 阈值
  const chineseRatio = stats.chinese / stats.total
  const japaneseRatio = stats.japanese / stats.total
  const koreanRatio = stats.korean / stats.total
  const englishRatio = stats.english / stats.total

  // 按优先级判断
  if (japaneseRatio > threshold) {
    return 'ja'
  }
  if (koreanRatio > threshold) {
    return 'ko'
  }
  if (chineseRatio > threshold) {
    return 'zh'
  }
  if (englishRatio > threshold) {
    return 'en'
  }

  // 默认返回英文
  return 'en'
}

/**
 * 根据语言代码获取语言配置
 */
export function getLanguageConfig(code: Language): LanguageConfig {
  return supportedLanguages.find(lang => lang.code === code) || supportedLanguages[1]
}

/**
 * 检测表单数据的主要语言
 */
export function detectFormLanguage(formData: {
  destination?: string
  interests?: string
  specialRequests?: string
}): Language {
  const textToAnalyze = [
    formData.destination || '',
    formData.interests || '',
    formData.specialRequests || '',
  ].join(' ')

  return detectLanguage(textToAnalyze)
}

/**
 * 获取语言的提示词前缀
 */
export function getLanguagePromptPrefix(language: Language): string {
  const prompts: Record<Language, string> = {
    auto: '',
    zh: '请用中文回答。',
    en: 'Please respond in English.',
    ja: '日本語で回答してください。',
    ko: '한국어로 답변해 주세요.',
  }

  return prompts[language] || prompts.en
}

/**
 * 获取语言的完整名称
 */
export function getLanguageName(code: Language, displayInNative: boolean = false): string {
  const config = getLanguageConfig(code)
  return displayInNative ? config.nativeName : config.name
}

