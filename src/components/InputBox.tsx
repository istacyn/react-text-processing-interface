import { useState } from "react";

interface InputBoxProps {
  onMessageUpdate: (message: string) => void;
}

const InputBox: React.FC<InputBoxProps> = ({ onMessageUpdate }) => {
  const [input, setInput] = useState("");
  let typingTimeout: ReturnType<typeof setTimeout> | null = null;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);

    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // Set new timeout to send message after user stops typing
    typingTimeout = setTimeout(() => {
      if (e.target.value.trim()) {
        onMessageUpdate(e.target.value);
        setInput(""); // Clear input after sending
      }
    }, 1000); // 1s delay before sending message
  };

  return (
    <div className="relative p-2 md:p-3 bg-white">
      <textarea
        className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={3}
        placeholder="Type a message..."
        value={input}
        onChange={handleInputChange}
        aria-label="Type a message"
      />
    </div>
  );
};

export default InputBox;
