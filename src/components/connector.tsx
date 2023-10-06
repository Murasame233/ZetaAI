import { Dialog, Transition } from '@headlessui/react'
import React, { Dispatch, Fragment, SetStateAction } from 'react'
import { useGlobalState } from '../Global'
import { XCircleIcon } from '@heroicons/react/20/solid'
import svgs from '../assets/wallets/svgs.ts'
import { AddressPurpose, BitcoinNetworkType, GetAddressOptions, GetAddressResponse, getAddress } from 'sats-connect'

interface ModalInnerState {
    current_wallet: string
}

interface ModalInnerStateContext {
    modalstate: Partial<ModalInnerState>,
    setmodalstate: Dispatch<SetStateAction<Partial<ModalInnerState>>>
}

const modalContext = React.createContext<ModalInnerStateContext>({ modalstate: {}, setmodalstate: () => { } })


export function WalletModal() {
    let { state, dispatch } = useGlobalState()
    let [modalstate, setmodalstate] = React.useState<Partial<ModalInnerState>>({ current_wallet: undefined })

    let closeRef = React.useRef(null)

    function closeModal() {
        dispatch({ WalletModal: false })
    }

    return (
        <modalContext.Provider value={{ modalstate, setmodalstate }}>
            <Transition appear show={state.WalletModal} as={Fragment}>
                <Dialog as="div" initialFocus={closeRef} className="relative z-10" onClose={closeModal}>
                    {/* BackGround */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    {/* Content */}
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="h-96 w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                    {/* Close */}
                                    <div ref={closeRef} className="absolute flex top-0 right-0 p-5">
                                        <XCircleIcon className='ml-auto h-6 text-blue-600 hover:text-blue-800 hover:cursor-pointer transition-colors' onClick={closeModal} />
                                    </div>
                                    <div className='grid grid-cols-3 h-full'>

                                        {/* Selector */}
                                        <div className='p-5 border-r-2' id='wallets'>
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                Choose your Wallet
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <WalletSelector></WalletSelector>
                                            </div>
                                        </div>
                                        {/* Connector */}
                                        <div className='col-span-2 p-5 h-full'>
                                            {
                                                (modalstate.current_wallet == "XDEFI") && (<XDEFIConnector />) || (<DefaultConnector />)
                                            }
                                        </div>
                                    </div>

                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </modalContext.Provider>
    )
}

function WalletSelector() {
    const wallets = [
        {
            name: 'XDEFI',
            icon: svgs.XDEFI
        },
        {
            name: 'MetaMask',
            icon: svgs.MetaMask
        },
        {
            name: 'WalletConnect',
            icon: svgs.walletConnect
        },
    ]

    let { modalstate, setmodalstate } = React.useContext(modalContext)


    return (
        <div className="w-full">
            <div className="mx-auto w-full max-w-md">
                <div className="space-y-2">
                    {wallets.map((wallet) => {
                        return (
                            <div key={wallet.name} className={`
                        ${(modalstate.current_wallet && (modalstate.current_wallet == wallet.name)) ? "bg-blue-300" : "hover:bg-stone-300"}
                        transition-colors relative flex cursor-pointer rounded-lg px-3 py-3 focus:outline-none`}
                                onClick={
                                    () => {
                                        if (modalstate.current_wallet != wallet.name) setmodalstate({ current_wallet: wallet.name });
                                        else { setmodalstate({ current_wallet: undefined }) }
                                    }
                                } >
                                <img src={wallet.icon} className='max-h-6 w-6 mr-1' />  {wallet.name}
                            </div>)
                    })}
                </div>
            </div>

        </div>
    )
}

function DefaultConnector() {
    return (
        <div className='flex justify-center items-center flex-wrap animate-fade h-full'>
            <div>
                <h3 className='text-lg font-medium'>Need a Wallet?</h3>
                <div>Google the wallets on the left.</div>
            </div>


        </div>
    )
}

function XDEFIConnector() {
    let {dispatch} = useGlobalState();
    const supportedChain = [
        {
            name: "BTC",
            icon: svgs.BTC,
            call: async () => {
                const getAddressOptions:GetAddressOptions = {
                    payload: {
                      purposes: [AddressPurpose.Payment],
                      message: 'Address for receiving payments',
                      network: {
                        type:BitcoinNetworkType.Testnet,
                      },
                    },
                    onFinish: (response: GetAddressResponse) => {
                      let result = response.addresses.find(address => address.purpose === AddressPurpose.Payment);
                      dispatch({userchain:"BTC",address:result?.address,WalletModal:false})
                    },
                    onCancel: () => alert('Request canceled'),
                    }
                      
                  await getAddress(getAddressOptions);
            }
        },
        {
            name: "ETH",
            icon: svgs.ETH
        },
        {
            name: "Polygon",
            icon: svgs.Polygon
        },
        {
            name: "BSC",
            icon: svgs.BSC
        }
    ]

    return (<div className='grid grid-cols-1 justify-center flex-wrap animate-fade h-full auto-rows-min'>
        {window.xfi ? <>
            <div className='flex justify-center'><h3 className='font-medium text-lg leading-6'>Choose Chain</h3></div>
            <div className='grid grid-cols-4 auto-rows-fr'>
                {supportedChain.map((chain) => {
                    return (
                        <div key={chain.name} onClick={chain.call} className='p-4 rounded-xl flex flex-col justify-center hover:cursor-pointer hover:bg-slate-300 transition-colors'>
                            <img src={chain.icon} className='h-1/3' />
                            <div className='self-center'>{chain.name}</div>
                        </div>
                    )
                })}
            </div></>
            :
            <>Please Install the XDEFI</>
        }
    </div>)
}


export function CurrentWallet() {
    let { state, dispatch } = useGlobalState()

    function openModal() {
        dispatch({ WalletModal: true })
    }
    return (
        <>
            <div className="inset-0 flex items-center justify-center">
                <button
                    type="button"
                    onClick={openModal}
                    className="truncate overflow-hidden w-36 bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                    {state.address?state.address:"Connect Wallet"}
                </button>
            </div>
        </>)
}