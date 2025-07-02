import CryptoJS from 'crypto-js';
import moment from 'moment';

/**
 * Generates the DOKU API request signature using CryptoJS
 *
 * @param {string} clientId - Client-Id from request header
 * @param {string} requestId - Request-Id from request header
 * @param {string} timestamp - Request-Timestamp from request header (ISO 8601)
 * @param {string} requestTarget - e.g., "/doku-virtual-account/v2/payment-code"
 * @param {Object|string} body - The request body (JSON object or string)
 * @param {string} secretKey - Your DOKU Secret Key
 * @returns {string} Signature value for the request header
 */
function generateDokuSignature(clientId, requestId, timestamp, requestTarget, body,) {
    const secretKey = process.env.DOKU_SECRET_KEY;
    // Ensure body is a string
    const jsonBody = typeof body === 'object' ? JSON.stringify(body) : body;

    // Step 1: Generate Digest
    const digest = digestBody(jsonBody);

    // Step 2: Prepare Signature Data String with escaped newlines
    const signatureData = [
        `Client-Id:${clientId}`,
        `Request-Id:${requestId}`,
        `Request-Timestamp:${timestamp}`,
        `Request-Target:${requestTarget}`,
        `Digest:${digest}`
    ].join('\\n');

    // Step 3: Generate HMAC-SHA256 signature
    const hmac = CryptoJS.HmacSHA256(signatureData, secretKey);
    const signatureHash = hmac.toString(CryptoJS.enc.Base64);

    return `HMACSHA256=${signatureHash}`;
}

/**
 * Helper: Compute SHA-256 base64 hash of the body
 */
function digestBody(bodyString) {
    if (typeof bodyString !== 'string') {
        throw new Error('Body must be a string for hashing');
    }

    const hash = CryptoJS.SHA256(bodyString);
    return CryptoJS.enc.Base64.stringify(hash);
}
export async function POST(request) {
    try {
        const body = await request.json();
        const { price, subscriptionId } = body;
        const anjing = {
            "order": {
                "amount": price,
                "invoice_number": subscriptionId,
                "currency": "IDR",
                "callback_url": "https://www.byscript.io/api/callback/doku",
                "callback_url_cancel": "https://merchantcallbackurl-cancel.domain",
                "callback_url_result": "https://merchantcallbackurl-cancel.domain",
                "language": "EN",
                "auto_redirect": true,
                "disable_retry_payment": true,
                "recover_abandoned_cart": true,
                "line_items": [
                    {
                        "id": "001",
                        "name": "Fresh flowers",
                        "quantity": 1,
                        "price": 40000,
                        "sku": "FF01",
                        "category": "gift-and-flowers",
                        "url": "http://item-url.domain/",
                        "image_url": "http://image-url.domain/",
                        "type": "ABC"
                    },
                ]
            },
            "payment": {
                "payment_due_date": 60,
                "type": "SALE",
                "payment_method_types": [
                    "VIRTUAL_ACCOUNT_BCA",
                    "VIRTUAL_ACCOUNT_BANK_MANDIRI",
                    "VIRTUAL_ACCOUNT_BANK_SYARIAH_MANDIRI",
                    "VIRTUAL_ACCOUNT_DOKU",
                    "VIRTUAL_ACCOUNT_BRI",
                    "VIRTUAL_ACCOUNT_BNI",
                    "VIRTUAL_ACCOUNT_BANK_PERMATA",
                    "VIRTUAL_ACCOUNT_BANK_CIMB",
                    "VIRTUAL_ACCOUNT_BANK_DANAMON",
                    "VIRTUAL_ACCOUNT_BNC",
                    "VIRTUAL_ACCOUNT_BTN",
                    "ONLINE_TO_OFFLINE_ALFA",
                    "CREDIT_CARD",
                    "DIRECT_DEBIT_BRI",
                    "EMONEY_SHOPEEPAY",
                    "EMONEY_OVO",
                    "EMONEY_DANA",
                    "QRIS",
                    "PEER_TO_PEER_AKULAKU",
                    "PEER_TO_PEER_KREDIVO",
                    "PEER_TO_PEER_INDODANA"
                ]
            },
            "customer": {
                "id": "JC-01",
                "name": "Zolanda",
                "last_name": "Anggraeni",
                "phone": "628121212121",
                "email": "zolanda@example.com",
                "address": "taman setiabudi",
                "postcode": "120129",
                "state": "Jakarta",
                "city": "Jakarta Selatan",
                "country": "ID"
            },
            "shipping_address": {
                "first_name": "Joe",
                "last_name": "Doe",
                "address": "Jalan DOKU no 15",
                "city": "Jakarta",
                "postal_code": "11923",
                "phone": "081312345678",
                "country_code": "IDN"
            },
            "billing_address": {
                "first_name": "Joe",
                "last_name": "Doe",
                "address": "Jalan DOKU no 15",
                "city": "Jakarta",
                "postal_code": "11923",
                "phone": "081312345678",
                "country_code": "IDN"
            },
            "additional_info": {
                "allow_tenor": [0, 3, 6, 12],
                "doku_wallet_notify_url": "https://dw-notification.merchantdomain",
                "override_notification_url": "https://another.example.com/payments/notifications"
            }
        }

        const clientId = process.env.DOKU_CLIENT_ID;
        const requestId = subscriptionId + "-" + Date.now();
        const requestTimestamp = moment.utc().format('YYYY-MM-DDTHH:mm:ss') + 'Z';
        let signature = generateDokuSignature(clientId, requestId, requestTimestamp, "/checkout/v1/payment", anjing);
        console.log(signature, 'signature');

        const r = await fetch('https://api.doku.com/checkout/v1/payment', {
            method: 'POST',
            headers: {
                "Request-Id": requestId,
                "Request-Timestamp": requestTimestamp,
                "Signature": signature,
                "Content-type": "application/json",
                "Client-Id": clientId,
            },
            body: JSON.stringify(anjing)
        });
        const paymentResponse = await r.json();
        if (r.status !== 200) {
            console.log('masuk sini;::', paymentResponse);
            throw new Error(paymentResponse.error.message);
        }
        return new Response(JSON.stringify({
            status: true,
            data: paymentResponse
        }), {
            status: 201
        })
    } catch (error) {
        console.log(error.message, ':::::error creating invoice');
        return new Response(JSON.stringify({
            status: false,
            message: error.message,
            error: 'internal server error!'
        }), {
            status: 500
        })
    }
}