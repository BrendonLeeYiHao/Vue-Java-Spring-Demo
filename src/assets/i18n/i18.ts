import { createI18n } from 'vue-i18n'
import en from './en.json'
import ms_MY from './ms_MY.json'
import zh from './zh.json'

// Create Vue I18n instance with options
const i18n = createI18n({
  legacy: false,
  locale: 'en', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    en,
    ms_MY,
    zh
  }
})

export default i18n
