
import generateSignatureRsa from "@/app/utils/generateSignatureRsa";


export const dynamic = 'force-dynamic';

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';


export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        const queryParams = `/public/api/v2/smart_trades/${id}`;
        const finalUrl = baseUrl + queryParams;
        const signatureMessage = queryParams;
        const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);

        const response2 = await fetch(finalUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                APIKEY: API_KEY,
                Signature: signature,
            }
        });
        const data = await response2.json();
        // console.log(response2, 'response2');
        if (!response2.ok) {
            return new Response(JSON.stringify({
                status: 'error',
                message: data.error,
                ...data
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        // console.log('Smart trade executed successfully, response:', data); 
        return new Response(JSON.stringify({
            status: 'success',
            data
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Trade execution failed:', error);
        return new Response(JSON.stringify({
            status: 'error',
            error: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
