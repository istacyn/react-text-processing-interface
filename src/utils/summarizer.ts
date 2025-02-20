export const isSummarizerSupported = () => {
    return self.ai?.summarizer !== undefined;
  };
  
  export const createSummarizer = async () => {
    if (!isSummarizerSupported()) {
      console.warn("Summarizer API is not supported in this browser.");
      return null;
    }
  
    const available = (await self.ai?.summarizer?.capabilities()?.then(res => res?.available)) ?? "no";
    if (available === "no") {
      console.warn("Summarizer API is not available at the moment.");
      return null;
    }
  
    const options: {
        sharedContext: string;
        type: "key-points" | "tl;dr" | "teaser" | "headline";
        format: "plain-text" | "markdown";
        length: "short" | "medium" | "long";
      } = {
        sharedContext: "This is a scientific article",
        type: "key-points",
        format: "markdown",
        length: "medium",
      };
  
    let summarizer;
    if (available === "readily") {
      summarizer = await self.ai?.summarizer?.create(options);
    } else {
      summarizer = await self.ai?.summarizer?.create(options);
      summarizer?.addEventListener("downloadprogress", (e: ProgressEvent) => {
        console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
      });
      if (summarizer?.ready) {
        await summarizer.ready;
      }
    }
  
    return summarizer;
  };
  
  export const summarizeText = async (text: string, context: string = "") => {
    const summarizer = await createSummarizer();
    if (!summarizer) return null;
  
    try {
      const summary = await summarizer.summarize(text, { context });
      return summary;
    } catch (error) {
      console.error("Summarization error:", error);
      return null;
    }
  };
  