
import generateSignatureRsa from "@/app/utils/generateSignatureRsa";


const API_KEY = process.env.THREE_COMMAS_API_KEY_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';


// Validation function
const validateBody = (body) => {
    const errors = [];

    if (!body.accountId) {
        errors.push('accountId is required');
    }
    if (body.pair && typeof body.pair !== 'string') {
        errors.push('pair must be a string');
    }
    if (body.value && (isNaN(body.value) || Number(body.value) <= 0)) {
        errors.push('units must be a positive number');
    }
    if (!body.type) {
        errors.push('please include type, "buy" or "sell"');
    }
    if (body.type && (body.type !== 'buy' && body.type !== 'sell')) {
        errors.push('type must be either "buy" or "sell" all lowercase');
    }

    return errors;
};



export async function POST(request) {
    try {
        const body = await request.json();
        // console.log('body', body);
        // Validate request body
        const validationErrors = validateBody(body);
        if (validationErrors.length > 0) {
            return new Response(JSON.stringify({
                status: 'error',
                errors: validationErrors
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { accountId, pair, value, type } = body;

        const bodySend = {
            account_id: accountId,
            pair,
            instant: "true",
            position: {
                type,
                units: {
                    value
                },
                order_type: "market"
            },
            leverage: {
                enabled: true,
                type: "custom",
                value: "1"
            }
        }
        const queryParams = `/public/api/v2/smart_trades`;
        const finalUrl = baseUrl + queryParams;
        const signatureMessage = queryParams + JSON.stringify(bodySend);
        const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);

        const response2 = await fetch(finalUrl, {
            method: 'POST',
            body: JSON.stringify(bodySend),
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
        console.log('Smart trade executed successfully, response:', data);
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
