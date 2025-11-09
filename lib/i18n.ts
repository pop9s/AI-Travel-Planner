/**
 * 国际化 (i18n) 配置
 * 支持界面多语言
 */

import { Language } from './languageDetection'

export interface Translations {
  // Header
  appTitle: string
  appSubtitle: string

  // Hero Section
  heroTitle: string
  heroDescription: string

  // Form
  formTitle: string
  formDescription: string
  destination: string
  destinationPlaceholder: string
  startDate: string
  duration: string
  durationPlaceholder: string
  travelers: string
  travelersPlaceholder: string
  budget: string
  budgetPlaceholder: string
  interests: string
  interestsPlaceholder: string
  specialRequests: string
  specialRequestsPlaceholder: string
  generateButton: string
  generating: string

  // Result
  resultTitle: string
  resultDescription: string
  resultPlaceholder: string
  downloadButton: string
  shareButton: string

  // Errors
  errorTitle: string
  fillAllFields: string

  // Footer
  footerText: string

  // Language
  language: string
  autoDetect: string

  // Budget Manager
  budgetTitle: string
  budgetDescription: string
  totalBudget: string
  spent: string
  remaining: string
  addExpense: string
  category: string
  amount: string
  description: string
  categoryFood: string
  categoryTransport: string
  categoryAccommodation: string
  categoryActivity: string
  categoryShopping: string
  categoryOther: string
  noExpenses: string
  analyzeButton: string
  analyzing: string
  aiAnalysis: string
}

const translations: Record<Language, Translations> = {
  auto: {} as Translations, // 自动检测不需要翻译
  
  zh: {
    appTitle: 'AI Travel Planner',
    appSubtitle: '智能旅行规划助手',
    heroTitle: '让AI为你规划完美旅程',
    heroDescription: '只需告诉我们你的需求，AI将为你量身定制专属旅行计划',
    formTitle: '填写旅行需求',
    formDescription: '请填写以下信息,AI将为您生成个性化旅行计划',
    destination: '目的地',
    destinationPlaceholder: '例如: 日本东京',
    startDate: '出发日期',
    duration: '旅行天数',
    durationPlaceholder: '例如: 7',
    travelers: '旅行人数',
    travelersPlaceholder: '例如: 2',
    budget: '预算(CNY)',
    budgetPlaceholder: '例如: 10000',
    interests: '兴趣爱好',
    interestsPlaceholder: '例如: 美食、历史文化、购物',
    specialRequests: '特殊要求',
    specialRequestsPlaceholder: '例如: 希望入住高评分酒店、需要无障碍设施、素食餐厅推荐等...',
    generateButton: '生成AI旅行计划',
    generating: 'AI正在生成规划中...',
    resultTitle: '你的专属旅行计划',
    resultDescription: '填写左侧表单后,AI将在这里生成详细的旅行计划',
    resultPlaceholder: '填写您的旅行偏好,让AI为您创建一个难忘的旅行体验',
    downloadButton: '下载计划',
    shareButton: '分享',
    errorTitle: '发生错误',
    fillAllFields: '请填写所有必填字段',
    footerText: 'Powered by AI • 让每一次旅行都成为美好回忆',
    language: '语言',
    autoDetect: '自动检测',
    budgetTitle: '费用预算与管理',
    budgetDescription: '智能记录旅行开销，AI为您分析预算使用情况',
    totalBudget: '总预算',
    spent: '已花费',
    remaining: '剩余',
    addExpense: '添加费用',
    category: '类别',
    amount: '金额',
    description: '备注',
    categoryFood: '餐饮',
    categoryTransport: '交通',
    categoryAccommodation: '住宿',
    categoryActivity: '活动',
    categoryShopping: '购物',
    categoryOther: '其他',
    noExpenses: '还没有记录任何费用',
    analyzeButton: 'AI 预算分析',
    analyzing: 'AI 分析中...',
    aiAnalysis: 'AI 预算分析',
  },

  en: {
    appTitle: 'AI Travel Planner',
    appSubtitle: 'Intelligent Travel Planning Assistant',
    heroTitle: 'Let AI Plan Your Perfect Journey',
    heroDescription: 'Just tell us your needs, and AI will create a customized travel plan for you',
    formTitle: 'Fill in Travel Requirements',
    formDescription: 'Please fill in the following information, and AI will generate a personalized travel plan for you',
    destination: 'Destination',
    destinationPlaceholder: 'e.g., Tokyo, Japan',
    startDate: 'Departure Date',
    duration: 'Duration (days)',
    durationPlaceholder: 'e.g., 7',
    travelers: 'Number of Travelers',
    travelersPlaceholder: 'e.g., 2',
    budget: 'Budget (CNY)',
    budgetPlaceholder: 'e.g., 10000',
    interests: 'Interests',
    interestsPlaceholder: 'e.g., Food, History, Shopping',
    specialRequests: 'Special Requests',
    specialRequestsPlaceholder: 'e.g., High-rated hotels, Accessible facilities, Vegetarian restaurants...',
    generateButton: 'Generate AI Travel Plan',
    generating: 'AI is generating your plan...',
    resultTitle: 'Your Personalized Travel Plan',
    resultDescription: 'Fill in the form on the left, and AI will generate a detailed travel plan here',
    resultPlaceholder: 'Share your travel preferences, and let AI create an unforgettable travel experience for you',
    downloadButton: 'Download Plan',
    shareButton: 'Share',
    errorTitle: 'Error Occurred',
    fillAllFields: 'Please fill in all required fields',
    footerText: 'Powered by AI • Making every trip a beautiful memory',
    language: 'Language',
    autoDetect: 'Auto Detect',
    budgetTitle: 'Budget & Expense Management',
    budgetDescription: 'Track travel expenses intelligently, AI analyzes your budget usage',
    totalBudget: 'Total Budget',
    spent: 'Spent',
    remaining: 'Remaining',
    addExpense: 'Add Expense',
    category: 'Category',
    amount: 'Amount',
    description: 'Description',
    categoryFood: 'Food & Dining',
    categoryTransport: 'Transportation',
    categoryAccommodation: 'Accommodation',
    categoryActivity: 'Activities',
    categoryShopping: 'Shopping',
    categoryOther: 'Other',
    noExpenses: 'No expenses recorded yet',
    analyzeButton: 'AI Budget Analysis',
    analyzing: 'AI Analyzing...',
    aiAnalysis: 'AI Budget Analysis',
  },

  ja: {
    appTitle: 'AI Travel Planner',
    appSubtitle: 'AI旅行プランニングアシスタント',
    heroTitle: 'AIが完璧な旅を計画',
    heroDescription: 'ご要望をお聞かせください。AIがカスタマイズされた旅行プランを作成します',
    formTitle: '旅行要件の入力',
    formDescription: '以下の情報を入力すると、AIがパーソナライズされた旅行プランを生成します',
    destination: '目的地',
    destinationPlaceholder: '例：東京、日本',
    startDate: '出発日',
    duration: '日数',
    durationPlaceholder: '例：7',
    travelers: '旅行者数',
    travelersPlaceholder: '例：2',
    budget: '予算（CNY）',
    budgetPlaceholder: '例：10000',
    interests: '興味',
    interestsPlaceholder: '例：グルメ、歴史、ショッピング',
    specialRequests: '特別なリクエスト',
    specialRequestsPlaceholder: '例：高評価ホテル、バリアフリー設備、ベジタリアンレストラン...',
    generateButton: 'AI旅行プランを生成',
    generating: 'AIがプランを生成中...',
    resultTitle: 'あなた専用の旅行プラン',
    resultDescription: '左側のフォームに入力すると、AIが詳細な旅行プランを生成します',
    resultPlaceholder: '旅行の好みを共有し、AIに忘れられない旅行体験を作成させましょう',
    downloadButton: 'プランをダウンロード',
    shareButton: '共有',
    errorTitle: 'エラーが発生しました',
    fillAllFields: 'すべての必須フィールドに入力してください',
    footerText: 'Powered by AI • すべての旅行を素晴らしい思い出に',
    language: '言語',
    autoDetect: '自動検出',
    budgetTitle: '予算管理',
    budgetDescription: '旅行費用をスマートに記録、AIが予算使用状況を分析',
    totalBudget: '総予算',
    spent: '使用済み',
    remaining: '残高',
    addExpense: '費用を追加',
    category: 'カテゴリー',
    amount: '金額',
    description: '備考',
    categoryFood: '食事',
    categoryTransport: '交通',
    categoryAccommodation: '宿泊',
    categoryActivity: 'アクティビティ',
    categoryShopping: 'ショッピング',
    categoryOther: 'その他',
    noExpenses: 'まだ費用が記録されていません',
    analyzeButton: 'AI予算分析',
    analyzing: 'AI分析中...',
    aiAnalysis: 'AI予算分析',
  },

  ko: {
    appTitle: 'AI Travel Planner',
    appSubtitle: 'AI 여행 계획 도우미',
    heroTitle: 'AI가 완벽한 여행을 계획합니다',
    heroDescription: '필요한 사항을 알려주시면 AI가 맞춤형 여행 계획을 만들어 드립니다',
    formTitle: '여행 요구사항 입력',
    formDescription: '다음 정보를 입력하시면 AI가 맞춤형 여행 계획을 생성합니다',
    destination: '목적지',
    destinationPlaceholder: '예: 도쿄, 일본',
    startDate: '출발 날짜',
    duration: '기간(일)',
    durationPlaceholder: '예: 7',
    travelers: '여행자 수',
    travelersPlaceholder: '예: 2',
    budget: '예산(CNY)',
    budgetPlaceholder: '예: 10000',
    interests: '관심사',
    interestsPlaceholder: '예: 음식, 역사, 쇼핑',
    specialRequests: '특별 요청',
    specialRequestsPlaceholder: '예: 높은 평가의 호텔, 장애인 편의시설, 채식 레스토랑...',
    generateButton: 'AI 여행 계획 생성',
    generating: 'AI가 계획을 생성 중...',
    resultTitle: '맞춤형 여행 계획',
    resultDescription: '왼쪽 양식을 작성하면 AI가 상세한 여행 계획을 생성합니다',
    resultPlaceholder: '여행 선호도를 공유하고 AI가 잊지 못할 여행 경험을 만들도록 하세요',
    downloadButton: '계획 다운로드',
    shareButton: '공유',
    errorTitle: '오류 발생',
    fillAllFields: '모든 필수 필드를 입력해주세요',
    footerText: 'Powered by AI • 모든 여행을 아름다운 추억으로',
    language: '언어',
    autoDetect: '자동 감지',
    budgetTitle: '예산 및 비용 관리',
    budgetDescription: '여행 비용을 스마트하게 기록, AI가 예산 사용 현황을 분석',
    totalBudget: '총 예산',
    spent: '사용',
    remaining: '남은 금액',
    addExpense: '비용 추가',
    category: '카테고리',
    amount: '금액',
    description: '설명',
    categoryFood: '음식',
    categoryTransport: '교통',
    categoryAccommodation: '숙박',
    categoryActivity: '활동',
    categoryShopping: '쇼핑',
    categoryOther: '기타',
    noExpenses: '아직 기록된 비용이 없습니다',
    analyzeButton: 'AI 예산 분석',
    analyzing: 'AI 분석 중...',
    aiAnalysis: 'AI 예산 분석',
  },
}

export function getTranslations(language: Language): Translations {
  return translations[language] || translations.zh
}

export function getSupportedLanguages(): Language[] {
  return Object.keys(translations).filter(lang => lang !== 'auto') as Language[]
}

