import { useEffect, useRef, useState } from "react";
import InputBox from "./InputBox";
import { translateText } from "../utils/translator";
import { detectLanguage } from "../utils/languageDetector";
import Spinner from "./Spinner";

const languageMap: { [key: string]: string } = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
  ru: "Russian",
  tr: "Turkish",
  fr: "French",
};

const ChatContainer = () => {
  const [messages, setMessages] = useState<
    { text: string; language: string; translation?: string }[]
  >([]);
  const [summaries, setSummaries] = useState<{ [index: number]: string }>({});
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isTranslating, setIsTranslating] = useState(false);
  const [loadingSummaries, setLoadingSummaries] = useState<{ [index:number]: boolean }>({});
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorSummaries, setErrorSummaries] = useState<{ [index: number]: string }>({});


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, summaries]);

  const handleMessageUpdate = async (message: string) => {
    if (!message.trim()) return;

    setIsSending(true);

    try {
      // Detect language
      const detectedLanguageCode: string | null = await detectLanguage(message);
      const detectedLanguage =
        detectedLanguageCode && languageMap[detectedLanguageCode]
          ? detectedLanguageCode
          : "en";

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, language: detectedLanguage },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false); 
    }
  };

  const handleTranslate = async () => {
    if (messages.length === 0) return;

    const lastIndex = messages.length - 1;
    const lastMessage = messages[lastIndex];

    if (!lastMessage || !lastMessage.language || lastMessage.language === selectedLanguage) return;

    try {
      setIsTranslating(true); 

      const translation = await translateText(lastMessage.text, lastMessage.language, selectedLanguage);
      if (!translation) throw new Error("Failed to get translation.");

      setMessages((prevMessages) =>
        prevMessages.map((msg, index) =>
          index === lastIndex ? { ...msg, translation } : msg
        )
      );
      
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage("Translation failed. Please try again.");
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };


const handleSummarize = async (text: string, index: number) => {
  if (!window.ai?.summarizer) {
    console.warn("Summarizer API is not available.");
    setErrorSummaries((prev) => ({ ...prev, [index]: "Summarization service is unavailable." }));
    return;
  }

  setLoadingSummaries((prev) => ({ ...prev, [index]: true })); // Show loading
  setErrorSummaries((prev) => ({ ...prev, [index]: "" })); // Clear previous errors

  try {
    console.log("Initializing summarizer...");

    const summarizer = await window.ai.summarizer.create({
      sharedContext: "This is a chat message",
      type: "tl;dr",
      format: "plain-text",
      length: "short",
    });

    console.log("Summarizer initialized. Summarizing...");

    const summary = await summarizer.summarize(text);

    console.log("Summary received:", summary);

    setSummaries((prev) => ({
      ...prev,
      [index]: summary,
    }));

    setErrorSummaries((prev) => ({ ...prev, [index]: "" })); // Clear any errors on success
  } catch (error) {
    console.error("Summarization error:", error);
    setErrorSummaries((prev) => ({ ...prev, [index]: "Failed to summarize. Please try again." }));
  } finally {
    setLoadingSummaries((prev) => ({ ...prev, [index]: false }));
  }
};


  return (
    <main className="flex flex-col w-full max-w-2xl mx-auto shadow-lg rounded-2xl bg-white h-screen font-inter pt-12 text-xs md:text-base">

      {/* Chat Container (scrollable) */}
      <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4" aria-live="polite">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">Translate or summarize text easily.</p>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="flex flex-col space-y-2">
              {/* Original Message */}
              <div className="flex justify-end">
                <div className="p-3 bg-blue-50 rounded-2xl shadow w-3/4 text-right">
                  <p>{msg.text}</p>
                  <p className="text-xs text-gray-500">
                    Detected: {languageMap[msg.language] || "Unknown"}
                  </p>
                </div>
              </div>

              {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

              {/* Translated Message */}
              {msg.translation && (
                <div className="flex justify-start">
                  <div className="p-3 bg-green-50 rounded-2xl shadow w-3/4 text-left">
                    <p className="italic">{msg.translation}</p>
                  </div>
                </div>
              )}

              {/* Summarization Button & Summary */}
              {msg.language === "en" && msg.text.length > 150 && !summaries[index] && (
                <div className="flex justify-center">
                  <button
                    onClick={() => handleSummarize(msg.text, index)}
                    className="p-2 mt-2 bg-slate-blue text-white rounded-2xl shadow hover:bg-deep-blue"
                  >
                    Summarize
                  </button>
                </div>
              )}
            
            {errorSummaries[index] && (
                <div className="flex justify-center">
                  <p className="text-red-500 text-sm">{errorSummaries[index]}</p>
                </div>
              )}

              {loadingSummaries[index] && (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              )}

              {/* Display Summary if available */}
              {summaries[index] && (
                <div className="flex justify-start">
                  <div className="p-3 bg-gray-200 rounded-lg shadow w-3/4 text-left">
                    <p className="text-gray-800 italic">{summaries[index]}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Translation Controls (Only for Last Message) */}
      {messages.length > 0 && (
        <div className="p-2 md:p-4 flex justify-between items-center bg-white">
          <select
            className="p-1 md:p-2 border rounded-lg"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {Object.entries(languageMap).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
          <button
            onClick={handleTranslate}
            className="p-2 bg-slate-blue text-white rounded-lg shadow hover:bg-deep-blue"
            disabled={isTranslating}
          >
            {isTranslating ? <Spinner /> : "Translate"}
          </button>
        </div>
      )}

      {/* Fixed Input Section */}
      <div className="bg-white">
        <InputBox onMessageUpdate={handleMessageUpdate} isSending={isSending}  />
      </div>
    </main>
  );
};

export default ChatContainer;
