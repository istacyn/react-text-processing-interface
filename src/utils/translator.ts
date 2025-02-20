export const SUPPORTED_LANGUAGES: { [key: string]: string } = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
  ru: "Russian",
  tr: "Turkish",
  fr: "French",
};

// Check if the Translator API is supported
export const isTranslatorSupported = () => {
  return self.ai?.translator !== undefined;
};

// Function to check if a language pair is available
export const isLanguagePairAvailable = async (
  sourceLang: string,
  targetLang: string
) => {
  if (!isTranslatorSupported()) return false;

  try {
    const capabilities = await self.ai?.translator?.capabilities();
    const result = capabilities?.languagePairAvailable(sourceLang, targetLang);

    return result === "readily" || result === "after-download";
    } catch (error) {
        console.error("Error checking language pair availability:", error);
        return false
    }
};

// Translate text using Chrome's Translator API
export const translateText = async (
  text: string,
  sourceLang: string,
  targetLang: string
) => {
  if (!isTranslatorSupported()) {
    console.warn("Translator API not supported in this browser.");
    return text;
  }

  try {
    const translator = await self.ai?.translator?.create({
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    });

    const translatedText = await translator?.translate(text);
    return translatedText ?? text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};
