import "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import fr from "./fr.json";
import ar from "./ar.json";

const options = {
  order: [
    "querystring",
    "navigator",
    "cookie",
    "localStorage",
    "sessionStorage",
    "htmlTag",
    "path",
    "subdomain",
  ],
  lookupQuerystring: "lng",
};

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  ar: {
    translation: ar,
  },
};

i18n
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    detection: options,
    resources,
    fallbackLng: "en", // default language
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
