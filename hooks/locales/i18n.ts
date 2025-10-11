import en from "@/constants/locales/en/translation.json";
import zh from "@/constants/locales/zh/translation.json";
import { getLocales } from 'expo-localization';
import i18n from "i18next";
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: en
  },
  zh: {
    translation: zh
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them
    resources,
    lng: getLocales()[0]?.languageCode || "en", // default
    fallbackLng: "en",
    //debug: true,
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  })
  .then();

export default i18n;