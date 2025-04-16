import generateSignatureRsa from "./generateSignatureRsa";

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;

const baseUrl = 'https://api.3commas.io';


export async function getSmartTradeStatus(id) {
    const totalParams = `/public/api/v2/smart_trades/${id}`;
    const finalUrl = baseUrl + totalParams;
    const signatureMessage = totalParams;
    const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
    const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            APIKEY: API_KEY,
            Signature: signature,
        }
    });
    const data = await response.json();
    return {
        ...data,
        id,
    }
}