import i18n from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Resources
import commonKk from '../../locales/kk/common.json';
import commonRu from '../../locales/ru/common.json';
import commonEn from '../../locales/en/common.json';

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    lng: 'ru',
    fallbackLng: 'ru',
    ns: ['common'],
    defaultNS: 'common',
    fallbackNS: 'common',
    nonExplicitWhitelist: true,
    debug: process.env.NODE_ENV === 'development',
    resources: {
      kk: {
        common: commonKk
      },
      ru: {
        common: commonRu
      },
      en: {
        common: commonEn
      }
    }
  });

export default i18n;
