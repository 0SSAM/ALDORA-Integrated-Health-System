import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

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
  branchId: number | null;
  jurisdictionId: number | null;
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
  const { user } = useAuth();
  const branchRegistry = trpc.regional.myBranchJurisdictions.useQuery(undefined, { enabled: Boolean(user), retry: false, refetchOnWindowFocus: false });
  const confirmedBranch = branchRegistry.data?.find(item => item.assignment?.jurisdictionId && item.profile?.active === 1) ?? null;
  const countryCode = confirmedBranch?.profile?.countryCode ?? "UNSET";
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
    setCountry: () => {
      // Legal jurisdiction is controlled by the authenticated branch registry;
      // a client-side country toggle must never change regulated behavior.
    },
    branchId: confirmedBranch?.branch?.id ?? null,
    jurisdictionId: confirmedBranch?.assignment?.jurisdictionId ?? null,
  }), [countryCode, defaults.currencyCode, defaults.locale, dictionary, language, confirmedBranch]);

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
