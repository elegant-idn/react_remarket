import i18n from "i18next";
import Backend from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: "en",   //default language
    fallbackLng: "en", //when specified language translations not present 
    //then fallbacklang translations loaded.
    debug: false,
    backend: {
      /* translation file path */
      loadPath: "/translations/{{lng}}.json",
    },

    /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
    },
    react: {
      wait: true,
    },
});


export default i18n;