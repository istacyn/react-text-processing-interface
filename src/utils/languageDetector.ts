const languageMap: { [key: string]: string } = {
    en: "English",
    pt: "Portuguese",
    es: "Spanish",
    ru: "Russian",
    tr: "Turkish",
    fr: "French",
  };
  
// ✅ Check if the Language Detector API is supported
  export const isLanguageDetectorSupported = () => {
    return self.ai?.languageDetector !== undefined;
  };
  
  // ✅ Initialize the language detector
  export const initializeLanguageDetector = async () => {
    if (!isLanguageDetectorSupported()) {
      console.warn("Language Detector API not supported in this browser.");
      return null;
    }
  
    try {
      const capabilities = await self?.ai?.languageDetector!.capabilities();
      if (capabilities?.available === "no") {
        console.warn("Language Detector is not available.");
        return null;
      }
  
      let detector;
      if (capabilities?.available === "readily") {
        detector = await self?.ai?.languageDetector!.create();
      } else {
        // Download the model before using
        detector = await self?.ai?.languageDetector!.create({
          monitor(m) {
            m.addEventListener("downloadprogress", (e: ProgressEvent) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        if (detector?.ready) {
            await detector.ready;
          } // Ensure it's ready
      }
  
      return detector;
    } catch (error) {
      console.error("Error initializing language detector:", error);
      return null;
    }
  };
  
  // ✅ Detect the language of a given text
  export const detectLanguage = async (text: string) => {
    const detector = await initializeLanguageDetector();
    if (!detector) return null;
  
    try {
      const result = await detector.detect(text);
      const detectedCode = result[0]?.detectedLanguage || "en";
    return detectedCode;
    } catch (error) {
      console.error("Error detecting language:", error);
    }
  
    return null;
  };
  