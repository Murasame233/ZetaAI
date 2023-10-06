import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/index.mjs";
import { useGlobalState } from "../Global";
import { useState } from "react";
import { functions, handleFunction } from "../functions/functions";

// OpenAI Client
export const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true
});

export class Chat {
    messages: ChatCompletionMessageParam[] = []
    constructor() {
        this.messages.push({
            role: "system", content: "You are a helpful assistant that\
         serve the ZetaChain user for some advice,\
         the user told you what they need, you help them. \
         there are some functions gived to you,\
         you can use it for interact with Zeta Blochain and give user a transaction to sign" })
    }
}

let controller: AbortController;

export function ChatPanel() {
    let { state, dispatch } = useGlobalState()
    let [input, setInput] = useState("")
    let [RunningCompletion, SetRun] = useState(false);

    const handleChange = (event: any) => setInput(event.target.value);
    let runCompletion = () => {
        SetRun(true)
        let input_now = "".concat(input);
        setInput("")
        let chats = state.chats;
        chats[state.current_chat].chat.messages.push({ role: "user", content: input_now });
        dispatch({ chats });

        controller = new AbortController();
        const signal = controller.signal;
        openai.chat.completions.create({
            model: "gpt-3.5-turbo", messages: chats[state.current_chat].chat.messages, functions
        }, { signal }).then((res) => {
            let message = res.choices[0].message;
            chats[state.current_chat].chat.messages.push(message);
            dispatch({ chats });
            SetRun(false)
        })
    }
    let cancelRun = () => {
        if (controller) {
            controller.abort();
        }
        SetRun(false)
    }
    return <><div className="flex flex-col-reverse w-full h-full">
        {
            RunningCompletion ?
                <>
                    <div onClick={cancelRun} className="w-full flex justify-center items-center p-6">
                        <div className="px-8 p-4 hover:bg-blue-300 hover:cursor-pointer transition-colors rounded">Stop</div>
                    </div>
                </>
                : <div id="input" className="w-full flex">
                    <input
                        onChange={handleChange}
                        value={input}
                        type="text"
                        placeholder="Type your message here"
                        className="p-2 m-2 h-12 w-full border-2 rounded-sm border-slate-400" maxLength={140} />
                    <div onClick={runCompletion} className="w-32 flex justify-center items-center">
                        <div className="hover:bg-blue-300 hover:cursor-pointer transition-colors p-1 rounded">Submit</div>
                    </div>
                </div>
        }
        {
            state.current_chat == -1 ? <></> : <div className="flex flex-col w-full h-full" id="chat">
                {state.chats[state.current_chat].chat.messages.map((message, index) => {
                    return <div key={index} className="flex flex-row w-full">
                        <div className="p-4 w-full">
                            {(() => {
                                if (message.function_call) {
                                    return <FunctionDialog functionCall={message.function_call}></FunctionDialog>
                                } else if (message.role == "user" || message.role == "assistant") {
                                    return <>
                                        <ChatDialog message={message}></ChatDialog>
                                    </>
                                }
                                else { return <></> }
                            })()}
                        </div>
                    </div>
                })}
            </div>
        }



    </div>

    </>
}

function ChatDialog(props: { message: ChatCompletionMessageParam }) {
    return <div
        className={`flex-row flex w-full
    ${props.message.role == "user" ? "justify-end pl-8" : "justify-start pr-8"}`}
    >
        <div className="p-4 rounded border border-black max-w-xl whitespace-pre-wrap">
            {props.message.content}
        </div>
    </div>
}

function FunctionDialog(props: { functionCall: ChatCompletionMessageParam.FunctionCall }) {
    let { state } = useGlobalState();
    return <>
        <div
            className="flex-row flex w-full justify-start pr-8">
            <div className="p-4 rounded border border-black max-w-xl flex flex-col items-center">
                <div className="text-xs font-bold mb-2">{props.functionCall.name}</div>
                <div> params: {props.functionCall.arguments}</div>
                <div className="px-8 py-4 hover:bg-blue-300 hover:cursor-pointer transition-colors rounded-lg" onClick={() => handleFunction(props.functionCall.name, JSON.parse(props.functionCall.arguments), state.address)}>Run</div>
            </div>
        </div>
    </>
}