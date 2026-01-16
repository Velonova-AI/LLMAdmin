import defaultMessages from "ra-language-english";
import dutchMessages from "ra-language-dutch";
import frenchMessages from "ra-language-french";
import germanMessages from "ra-language-german";
import polyglotI18nProvider from "ra-i18n-polyglot";

const englishCustomMessages = {
  ...defaultMessages,
  page: {
    ...(defaultMessages.page && typeof defaultMessages.page === 'object' ? defaultMessages.page : {}),
    learn: "Learn",
    "learn.introduction": "Introduction",
    "learn.mvp": "MVP",
    "learn.promptEngineering": "Prompt Engineering",
    "learn.vibeCoding": "Vibe Coding",
    "learn.gettingStarted": "Getting Started",
  },
};

const dutchCustomMessages = {
  ...dutchMessages,
  page: {
    ...(dutchMessages.page && typeof dutchMessages.page === 'object' ? dutchMessages.page : {}),
    learn: "Leren",
    "learn.introduction": "Introductie",
    "learn.mvp": "MVP",
    "learn.promptEngineering": "Prompt Engineering",
    "learn.vibeCoding": "Vibe Coderen",
    "learn.gettingStarted": "Aan de slag",
  },
};

const frenchCustomMessages = {
  ...frenchMessages,
  page: {
    ...(frenchMessages.page && typeof frenchMessages.page === 'object' ? frenchMessages.page : {}),
    learn: "Apprendre",
    "learn.introduction": "Introduction",
    "learn.mvp": "MVP",
    "learn.promptEngineering": "Ingénierie de Prompt",
    "learn.vibeCoding": "Codage Vibe",
    "learn.gettingStarted": "Commencer",
  },
};

const germanCustomMessages = {
  ...germanMessages,
  page: {
    ...(germanMessages.page && typeof germanMessages.page === 'object' ? germanMessages.page : {}),
    learn: "Lernen",
    "learn.introduction": "Einführung",
    "learn.mvp": "MVP",
    "learn.promptEngineering": "Prompt-Engineering",
    "learn.vibeCoding": "Vibe-Codierung",
    "learn.gettingStarted": "Erste Schritte",
  },
};

const messages = {
  en: englishCustomMessages,
  nl: dutchCustomMessages,
  fr: frenchCustomMessages,
  de: germanCustomMessages,
};

export const i18nProvider = polyglotI18nProvider(
  (locale: string) => (messages[locale as keyof typeof messages] || messages.en) as any,
  "en",
  [
    { locale: "en", name: "English" },
    { locale: "nl", name: "Nederlands" },
    { locale: "fr", name: "Français" },
    { locale: "de", name: "Deutsch" },
  ],
  { allowMissing: true },
);
