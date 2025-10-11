import { getLocales } from 'expo-localization';
import { TFunction } from 'i18next';
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import i18n from "./i18n";

export type LanguageContextProps  = {
  locale: string;
  setLanguage: (language: string) => Promise<void>;
  t: TFunction<"translation", undefined>
}

export const LanguageContext = createContext<LanguageContextProps|null>(null);

type LanguageProviderProps = {
  children: React.ReactNode;
}

export default function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocale] = useState(i18n.language);
  const { t } = useTranslation(); 

  useEffect(() => {
    const initialze = async () => {
      const deviceLocale = getLocales()[0]?.languageCode || "en";
      setLanguage(deviceLocale);
    };
    initialze();
  },[]);

 // Function to change the language and update localized strings
  const setLanguage = async (language: string) => {
    i18n.changeLanguage(language);
    setLocale(language);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLocalization = () => {
  const languageContext = useContext(LanguageContext);
  if(!languageContext) {
    throw new Error("language no found");
  }
  return languageContext;
}
