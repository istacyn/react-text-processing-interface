import { CircleHelp } from "lucide-react";
import logo from "../assets/logo.svg";
import { useState } from "react";
import HelpPopover from "./HelpPopover";

const Navbar = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full h-12 flex justify-between items-center py-2 md:py-4 px-4 md:px-16 bg-white shadow-md z-50">
      {/* Logo Section */}
      <div className="flex gap-1 items-center">
        <img
          src={logo}
          alt="Lingo AI Logo"
          className="w-[3rem] md:w-[4rem] h-[3rem] md:h-[4rem]"
        />
        <h1 className="text-base md:text-lg text-slate-blue font-mont font-bold">
          LingoAI
        </h1>
      </div>

      {/* Help Button */}
      <button
        className="relative text-slate-blue hover:text-deep-blue"
        onClick={() => setShowHelp(!showHelp)}
      >
        <CircleHelp className="text-base md:text-lg" aria-label="Help" />
      </button>

      {/* Popover Component */}
      {showHelp && <HelpPopover onClose={() => setShowHelp(false)} />}
    </div>
  );
};

export default Navbar;
