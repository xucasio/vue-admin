import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementTWLocale from 'element-ui/lib/locale/lang/zh-TW'// element-ui lang
import enLocale from './en'
import zhLocale from './zh'
import twLocale from './tw'

Vue.use(VueI18n)

const messages = {
    en: {
        ...enLocale,
        ...elementEnLocale
    },
    zh: {
        ...zhLocale,
        ...elementZhLocale
    },
    tw: {
        ...twLocale,
        ...elementTWLocale
    }
}

const i18n = new VueI18n({
    // set locale
    // options: en or zh
    locale: localStorage.getItem('lang') || 'zh',
    // set locale messages
    messages
})

export default i18n
