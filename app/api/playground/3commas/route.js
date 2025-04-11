import generateSignatureRsa from "@/app/utils/generateSignatureRsa";

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';

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
  const body = await request.json();
  try {
    const totalParams = `/public/api` + body.queryParams;
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
        console.log(data,'data... response not ok')
        return new Response(JSON.stringify({
            status: false,
            message: data.error,
            errorCode: data.code
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        })
    }
    return new Response(JSON.stringify({
        status: true,
        data : data
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