import generateSignatureRsa from "@/app/utils/generateSignatureRsa";

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';
export const maxDuration = 60; // This function can run for a maximum of 60 seconds

// queryParamsExample ==> `/v2/smart_trades`;
// example body ==>
// {
//     "queryParams": "/public/api/v2/smart_trades",
//     "method": "POST",
//     "body": {
//         "name": "string",
//         "pairs": [
//             "string"
//         ],
//         "bot_volumes": [
//             0
//         ],
//         "start_time": "string",
//         "end_time": "string",
// }


export async function POST(request) {
    try {
        const body = await request.json();
        console.log(body, 'body')
        let totalParams = `/public/api` + body.queryParams;
        if (body?.bodySend && Object.keys(body?.bodySend).length > 0) {
            totalParams += JSON.stringify(body.bodySend)
        }
        const finalUrl = baseUrl + totalParams;
        const signature = generateSignatureRsa(PRIVATE_KEY, totalParams);
        const response = await fetch(finalUrl, {
            method: body.method,
            body: body.bodySend ? JSON.stringify(body.bodySend) : null,
            headers: {
                'Content-Type': 'application/json',
                APIKEY: API_KEY,
                Signature: signature,
            }
        });
        const data = await response.json();
        if (!response.ok) {
            console.log(data, 'data... response not ok')
            const returnErrorData = {
                status: false,
                error: data.error + ' ' + data?.error_attributes,
                message: data.error,
                error_attributes: data?.error_attributes,
                errorCode: data.code,
                error_description: data?.error_description
            }
            if (data.error === 'signature_invalid') {
                returnErrorData.calculatedSignature = signature;
            }
            return new Response(JSON.stringify(returnErrorData), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            })
        }
        return new Response(JSON.stringify({
            status: true,
            data: data
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({
            status: false,
            message: error.message,
            errorCode: error.code
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}