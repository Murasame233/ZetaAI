import { ChatCompletionCreateParams } from "openai/resources/chat/index.mjs";
import { Buffer } from "buffer";



export const functions: ChatCompletionCreateParams.Function[] = [
    // GetUserProducts
    {
        name: "Make_BTC_Zeta_Call",
        description: "let User use btc wallet to make a contract call to zetachain",
        parameters: {
            type: "object",
            properties: {
                contract: {
                    type: "string",
                    description: "The Contract Address",
                },
            },
            required: ["recipient", "amountSats"],
        },
    },
    {
        name: "Make_BTC_Zeta_Transfer",
        description: "let User use btc wallet to make a call to zetachain, you have to know where user want to transfer, and amount",
        parameters: {
            type: "object",
            properties: {
                recipient: {
                    type: "string",
                    description: "The recipient address in ZetaChain.",
                },
                amountSats: {
                    type: "number",
                    description: "The amount of sats to transfer",
                }
            },
            required: ["recipient", "amountSats"],
        },
    },
];

interface Make_BTC_Zeta_CallParam {
    contract: string
}

export function Make_BTC_Zeta_Call(param: Make_BTC_Zeta_CallParam) {

}


interface Make_BTC_Zeta_TransferParam {
    recipient: string
    amountSats: number
}

function hex2a(hex:string) 
{
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}     

function Make_BTC_Zeta_Transfer(param: Make_BTC_Zeta_TransferParam, sender: string) {
    let hex = param.recipient.substring(2);
    let converted = hex2a(hex);
    let p = [{
        feeRate: 5,
        from: sender,
        recipient: "tb1qy9pqmk2pd9sv63g27jt8r657wy0d9ueeh0nqur",
        amount: { amount: param.amountSats, decimals: 8 },
        memo: converted
    }]
    console.log(p)
    window.xfi["bitcoin"].request(
        {
            method: "transfer",
            params: p
        },
        (error: any, result: any) => {
            console.log(error, result);
        }
    )

}

export function handleFunction(functionName: string, param: any, user_address: string) {
    console.log("%s %s", functionName, user_address)
    console.log(param)
    switch (functionName) {
        case "Make_BTC_Zeta_Call":
            Make_BTC_Zeta_Call(param);
            break;
        case "Make_BTC_Zeta_Transfer":
            Make_BTC_Zeta_Transfer(param, user_address);
            break;
    }
}