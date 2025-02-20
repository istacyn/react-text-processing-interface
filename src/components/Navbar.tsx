import { CircleHelp } from 'lucide-react';
import logo from "../assets/logo.svg"

const Navbar = () => {
  return (
    <div className='w-full h-12 flex justify-between items-center py-2 md:py-4 px-4 md:px-16'>
      <div className='flex gap-1 items-center'>
      <img src={logo} className='w-[3rem] md:w-[4rem] h-[3rem] md:h-[4rem]'/>
      <h1 className='text-base md:text-lg text-slate-blue font-mont font-bold'>LingoAI</h1>
      </div>
        <CircleHelp className="text-slate-blue cursor-pointer hover:text-deep-blue text-base md:text-lg" aria-label="Help"/>
    </div>
  )
}

export default Navbar