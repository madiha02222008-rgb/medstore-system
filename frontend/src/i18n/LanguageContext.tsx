import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Lang, TranslationKey } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem("medstock_lang");
    return saved === "hi" || saved === "en" ? saved : "en";
  });

  useEffect(() => {
    localStorage.setItem("medstock_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
  }

  function t(key: TranslationKey): string {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.en;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
