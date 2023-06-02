import { I18n } from "i18n-js";
import en from "../assets/translations/en.json";
import ja from "../assets/translations/ja.json";
import es from "../assets/translations/es.json";
import fr from "../assets/translations/fr.json";

const translations = {
  en,
  es,
  fr,
  ja,
};

export const translationKeys = ["en", "es", "fr", "ja"];
export const i18n = new I18n(translations);
