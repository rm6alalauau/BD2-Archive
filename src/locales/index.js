// 多語言資源系統
import zhHantTW from './zh-Hant-TW.js'
import en from './en.js'
import jaJP from './ja-JP.js'
import koKR from './ko-KR.js'

// 語言資源對照表
const messages = {
  'zh-Hant-TW': zhHantTW,
  'en': en,
  'ja-JP': jaJP,
  'ko-KR': koKR
}

// 獲取翻譯函數
export function getTranslation(key, language = 'zh-Hant-TW', params = {}) {
  const keys = key.split('.')
  let value = messages[language]
  
  // 遞歸查找嵌套的 key
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // 如果找不到對應語言的文字，fallback 到繁體中文
      if (language !== 'zh-Hant-TW') {
        return getTranslation(key, 'zh-Hant-TW', params)
      }
      console.warn(`Translation key "${key}" not found for language "${language}"`)
      return key // 如果連繁體中文都找不到，返回 key 本身
    }
  }
  
  // 處理參數替換
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] || match
    })
  }
  
  return value
}

// 舊版相容性
export function t(key, lang = 'zh-Hant-TW', params = {}) {
  return getTranslation(key, lang, params)
}

export default {
  messages,
  getTranslation,
  t
} 