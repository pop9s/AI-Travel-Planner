'use client'

import { Globe } from 'lucide-react'
import { Language, supportedLanguages } from '@/lib/languageDetection'

interface LanguageSelectorProps {
  currentLanguage: Language
  onLanguageChange: (language: Language) => void
}

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="relative inline-block">
      <label htmlFor="language-select" className="sr-only">
        Select Language
      </label>
      <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
        <Globe className="h-4 w-4 text-gray-600" />
        <select
          id="language-select"
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="bg-transparent border-none outline-none cursor-pointer text-sm font-medium text-gray-700 pr-2"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

