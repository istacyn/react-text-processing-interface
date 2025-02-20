import ChatContainer from './components/ChatContainer'
import Navbar from './components/Navbar'

function App() {

  return (
    <div className="h-screen w-full flex flex-col items-center overflow-hidden">
      <Navbar />
      <ChatContainer />
    </div>
  )
}

export default App