import i18n from 'i18next';
import LanguageDetector from 'i18next-react-native-language-detector';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/translation.json';
import fr from '../locales/fr/translation.json';

// Initialize i18n
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        fr: { translation: fr },
      },
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      react: {
        useSuspense: false,
      },
    });
}

export default i18n; 