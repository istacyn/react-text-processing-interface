import { X } from "lucide-react";

interface HelpPopoverProps {
  onClose: () => void;
}

const HelpPopover = ({ onClose }: HelpPopoverProps) => {
  return (
    <div className="absolute top-12 right-4 bg-white border border-gray-300 shadow-lg p-4 rounded-lg w-64 z-50">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-700">How to Use</h3>
        <button onClick={onClose}>
          <X className="w-4 h-4 text-gray-500 hover:text-black" />
        </button>
      </div>
      <ul className="text-sm text-gray-600 mt-2 space-y-2">
        <li>💬 Enter text in the input box.</li>
        <li>🌍 Choose a language to translate to in the options.</li>
        <li>📝 For English content with more than 150 words, click "Summarize" for quick summary.</li>
      </ul>
    </div>
  );
};

export default HelpPopover;
