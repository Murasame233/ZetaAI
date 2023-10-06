import React, { ReactNode } from "react";
import { Dispatch } from "react";
import { Chat } from "./components/Chat";

export interface AChat {
    name: string,
    chat: Chat
}

export interface GlobalState {
    WalletModal: boolean,
    userchain: string;
    address: string;
    chats: Array<AChat>
    current_chat:number
}

const defaultGlobalState: GlobalState = {
    WalletModal: false,
    userchain: "",
    address: "",
    chats: [],
    current_chat:-1
};

function getGlobalStateFromLocalState(): GlobalState {
    const localstate = localStorage.getItem("globalstate");
    let c = { ...defaultGlobalState };
    if (localstate) {
        return Object.assign(c, JSON.parse(localstate));
    }
    return defaultGlobalState;
}

const GlobalStateContext = React.createContext({
    state: {} as GlobalState,
    dispatch: {} as Dispatch<Partial<GlobalState>>,
});

type Props = {
    children: ReactNode;
};


export const GlobalStateProvider = ({ children }: Props) => {
    const [state, dispatch] = React.useReducer(
        (state: GlobalState, newValue: Partial<GlobalState>) => {
            let newState = { ...state, ...newValue };
            // sync to local state
            localStorage.setItem("globalstate", JSON.stringify(newState));
            return newState;
        },
        getGlobalStateFromLocalState()
    );
    return (
        <GlobalStateContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalStateContext.Provider>
    );
};


export const useGlobalState = () => {
    const context = React.useContext(GlobalStateContext);
    if (!context) {
        throw new Error("useGlobalState must be used within a GlobalStateContext");
    }
    return context;
};

