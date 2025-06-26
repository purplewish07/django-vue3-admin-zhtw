import { createI18n } from 'vue-i18n'
import settings from '@/settings'
import { getCookieItem } from '@/utils/storage'

import en from './en'
import zhTW from './zhtw'

export const messages = {
  'zhTW': zhTW,
  en
}

const i18n = createI18n({
  legacy: false,
  locale: getCookieItem('locale', settings.locale),
  messages
})

export default i18n
