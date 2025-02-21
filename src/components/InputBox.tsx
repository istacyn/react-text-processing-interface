import { ArrowUp } from "lucide-react";
import { useState } from "react";
import Spinner from "./Spinner";

interface InputBoxProps {
  onMessageUpdate: (message: string) => void;
  isSending: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ onMessageUpdate, isSending }) => {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

  };

  const handleSendMessage = () => {
    if (!input.trim()) {
      setErrorMessage("Text is required.");
      return;
    }
    setErrorMessage(null);
    onMessageUpdate(input);
    setInput("");
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents new line in textarea
      handleSendMessage();
    }
  };

  return (
    <div className="relative p-2 md:p-3 bg-white">
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      <label htmlFor="message-input" className="sr-only">Type a message</label>
      <textarea
      id="message-input"
        className="w-full p-2 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-xs md:text-base"
        rows={3}
        placeholder="To translate or summarize text, enter or paste it here and press send button"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        aria-label="Type a message"
      />

      <button
        onClick={handleSendMessage}
        className={`absolute bottom-5 md:bottom-6 right-3 md:right-6 bg-slate-blue text-white p-2 rounded-full shadow-md hover:bg-deep-blue focus:outline-none ${
          isSending ? "opacity-50 cursor-not-allowed" : "hover:bg-deep-blue"
        }`}
        disabled={isSending}
        aria-label="Send message"
      >
        {isSending ? <Spinner size="small" /> : <span><ArrowUp className="w-3 md:w-5 h-3 md:h-5" /></span>}
        {/* <ArrowUp className="w-5 h-5" /> */}
      </button>
    </div>
  );
};

export default InputBox;
