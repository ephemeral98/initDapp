import { watchEffect } from 'vue';
import { createI18n } from 'vue-i18n';
import cn from './cn.json';
import en from './en.json';

// 默认语言
export const defaultLang = 'en';

let i18n;
watchEffect(() => {
  console.log(`切换语言...`, localStorage.getItem('lang'));
  i18n = createI18n({
    fallbackLocale: defaultLang,
    globalInjection: true,
    legacy: false, // you must specify 'legacy: false' option
    locale: localStorage.getItem('lang') || defaultLang,
    messages: {
      cn,
      en,
    },
  });
});

export default i18n;
