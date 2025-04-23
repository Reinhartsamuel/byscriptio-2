import generateSignatureRsa from "@/app/utils/generateSignatureRsa";

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';


export async function GET(request) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    try {
        const totalParams = `/public/api/v2/smart_trades/${id}`;
        const finalUrlCloseMarket = baseUrl + totalParams;
        const signatureMessage = totalParams;
        const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
        const response = await fetch(finalUrlCloseMarket, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                APIKEY: API_KEY,
                Signature: signature,
            }
        });
        const data = await response.json();
        if (!response.ok) {
            console.log(data, 'data... response not ok')
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
            data
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