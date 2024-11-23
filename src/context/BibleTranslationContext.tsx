import { createContext, useContext, useState, ReactNode } from "react";

type TranslationShortNameContextType = {
  shortName: string | undefined;
  setShortName: (translation: string | undefined) => void;
};

const TranslationShortNameContext = createContext<
  TranslationShortNameContextType | undefined
>(undefined);

export const BibleTranslationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [shortName, setShortName] = useState<string | undefined>(undefined);

  return (
    <TranslationShortNameContext.Provider value={{ shortName, setShortName }}>
      {children}
    </TranslationShortNameContext.Provider>
  );
};

export const useTranslationShortNames = () => {
  const context = useContext(TranslationShortNameContext);
  if (!context) {
    throw new Error(
      "useTranslationShortNames must be used within a BibleTranslationProvider"
    );
  }
  return context;
};
