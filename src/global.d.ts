export {};

declare global {
  interface Window {
    ai?: {
      translator?: {
        capabilities: () => Promise<{ languagePairAvailable: (source: string, target: string) => string }>;
        create: (options: { sourceLanguage: string; targetLanguage: string }) => Promise<{ translate: (text: string) => Promise<string> }>;
      };
      languageDetector?: {
        capabilities: () => Promise<{ available: "no" | "readily" | "after-download" }>;
        create: (options?: { monitor?: (m: EventTarget & { addEventListener: (type: string, listener: (event: ProgressEvent) => void) => void }) => void }) => Promise<{ 
          detect: (text: string) => Promise<{ detectedLanguage: string; confidence: number }[]>;
          ready?: Promise<void>;
        }>;
      };
      summarizer?: {
        capabilities: () => Promise<{ available: "no" | "readily" | "after-download" }>;
        create: (options?: {
          sharedContext?: string;
          type?: "key-points" | "tl;dr" | "teaser" | "headline";
          format?: "markdown" | "plain-text";
          length?: "short" | "medium" | "long";
          monitor?: (m: EventTarget) => void; // ✅ monitor uses EventTarget
        }) => Promise<SummarizerInstance>;
      };
    };
  }

  interface SummarizerInstance extends EventTarget {
    summarize: (text: string, options?: { context?: string }) => Promise<string>;
    summarizeStreaming: (text: string, options?: { context?: string }) => ReadableStream<string>;
    ready?: Promise<void>;

    // ✅ Define addEventListener for downloadprogress event
    addEventListener: (type: "downloadprogress", listener: (event: ProgressEvent) => void) => void;
  }
}
