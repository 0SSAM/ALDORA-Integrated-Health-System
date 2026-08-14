import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ClientLocalization = {
  countryCode: string;
  locale: string;
  language: string;
  direction: "rtl" | "ltr";
  currencyCode: string;
  calendar: string;
  numberingSystem: string;
  t: (key: string) => string;
  formatCurrency: (amount: number) => string;
  setCountry: (countryCode: string) => void;
};

const dictionaries: Record<string, Record<string, string>> = {
  ar: {
    pharmacy: "الصيدلية",
    prescription: "الوصفة الطبية",
    invoice: "الفاتورة",
    branch: "الفرع",
    country: "الدولة",
  },
};

const countryDefaults: Record<string, { locale: string; currencyCode: string }> = {
  UNSET: { locale: "ar", currencyCode: "XXX" },
  EG: { locale: "ar-EG", currencyCode: "EGP" },
  SA: { locale: "ar-SA", currencyCode: "SAR" },
  AE: { locale: "ar-AE", currencyCode: "AED" },
};

const LocalizationContext = createContext<ClientLocalization | null>(null);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [countryCode, setCountryCode] = useState(() => localStorage.getItem("bdf-country") ?? "UNSET");
  const defaults = countryDefaults[countryCode] ?? { locale: "ar", currencyCode: "XXX" };
  const language = defaults.locale.split("-")[0] ?? "ar";
  const dictionary = dictionaries[language] ?? dictionaries.ar;
  const value = useMemo<ClientLocalization>(() => ({
    countryCode,
    locale: defaults.locale,
    language,
    direction: language === "ar" ? "rtl" : "ltr",
    currencyCode: defaults.currencyCode,
    calendar: "gregory",
    numberingSystem: "latn",
    t: (key) => dictionary[key] ?? dictionaries.ar[key] ?? key,
    formatCurrency: (amount) => new Intl.NumberFormat(`${defaults.locale}-u-ca-gregory-nu-latn`, { style: "currency", currency: defaults.currencyCode }).format(amount),
    setCountry: (next) => {
      const normalized = next.trim().toUpperCase();
      localStorage.setItem("bdf-country", normalized);
      setCountryCode(normalized);
    },
  }), [countryCode, defaults.currencyCode, defaults.locale, dictionary, language]);

  useEffect(() => {
    document.documentElement.lang = value.language;
    document.documentElement.dir = value.direction;
    document.documentElement.dataset.country = value.countryCode;
  }, [value]);

  return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}

export function useLocalization() {
  const value = useContext(LocalizationContext);
  if (!value) throw new Error("useLocalization must be used inside LocalizationProvider");
  return value;
}
