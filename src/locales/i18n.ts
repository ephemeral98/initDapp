import { watchEffect } from 'vue';
import { createI18n } from 'vue-i18n';
import cn from './cn';
import en from './en';

let i18n;
watchEffect(() => {
  console.log(`localStorage.getItem('lang')...`, localStorage.getItem('lang'));
  i18n = createI18n({
    fallbackLocale: 'en',
    globalInjection: true,
    legacy: false, // you must specify 'legacy: false' option
    locale: localStorage.getItem('lang') || 'en',
    messages: {
      cn,
      en,
    },
  });
});

export default i18n;
