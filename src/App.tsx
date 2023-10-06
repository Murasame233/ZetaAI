import './App.scss'
import { ChatPanel } from './components/Chat'
import { CurrentWallet, WalletModal } from './components/connector'
import { SideBar } from './components/sidebar'

function App() {
  return (
    <>
      {/* Wallet Connect Modal */}
      <WalletModal></WalletModal>
      {/* Header */}
      <div className="flex items-center px-1 border-b-2" id="header">
        <span className="text-base">ZetaAI</span>
        <span className='ml-auto'>
          <CurrentWallet></CurrentWallet>
        </span>
      </div>
      {/* Main Content */}
      <div className="flex" id="main">
        {/* Sidebar and main */}
        <div className='col-span-1 grid justify-items-center'><SideBar></SideBar></div>
        <div className="w-full">
          {/* Main Content */}
          <ChatPanel></ChatPanel>
        </div>

      </div>
    </>
  )
}

export default App
