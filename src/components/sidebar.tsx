import { useGlobalState } from "../Global"
import { Chat } from "./Chat"



export function SideBar() {
    let { state, dispatch } = useGlobalState()

    let createChat = () => {
        dispatch({
            chats: [
                ...state.chats,
                { name: "Chat", chat: new Chat() }
            ]
        })
    }

    return <>
        <div className="w-40 flex justify-center flex-wrap content-start">
            <Item name="Create" active={false} onClick={createChat}></Item>
            {state.chats.map((v,id) => {
                return <Item key={id} name={v.name} active={state.current_chat == id} onClick={() => { dispatch({ current_chat: id }) }} />  // And item on side bar
            })}
        </div>
    </>
}

interface itemProps {
    name: string
    active: boolean
    onClick: () => void
}

function Item(props: itemProps) {
    // And item on side bar
    return <>
        <div
            onClick={props.onClick}
            className={`m-2 h-12 w-32 hover:cursor-pointer rounded-md flex justify-center items-center 
            ${props.active ? "bg-slate-600 text-stone-50" : "hover:bg-slate-300"}`}>
            {props.name}
        </div>
    </>
}