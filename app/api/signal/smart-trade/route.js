import generateSignatureRsa from "@/app/utils/generateSignatureRsa";
import { adminDb } from "@/lib/firebase-admin-config";
import moment from "moment";
const API_KEY = process.env.THREE_COMMAS_API_KEY_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';


const validateBody = (body) => {
    const errors = [];

    if (!body.pair) {
        errors.push('pair is required');
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



async function sendTelegramMessage(body) {
    const telegram_bot_token = process.env.TELEGRAM_BOT_TOKEN;
    try {
        const { pair, price, time_frame, timestamp, action, trading_plan_id } = body;
        const messageTelegram = `pair: ${pair} \n price: ${price} \n timeframe: ${time_frame} \n timestamp: ${timestamp} \n date: ${moment.unix(timestamp).format('DD-MM-YYYY HH:mm')} \n action: ${action === 'close_at_market_price' ? 'SELL' : 'BUY'} \n trading_plan_id: ${trading_plan_id}`
        const res = await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: "-1002265379113",
                text: messageTelegram
            })
        })
        const resTelegram = await res.json();
        console.log(resTelegram, 'resTelegram')
    } catch (error) {
        console.log(error.message + ' :::error sending to telegram')
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            pair,
            type,
            trading_plan_id,
            price
        } = body;

        await sendTelegramMessage(body);
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

        // find all dca_bots from dca_bots collection
        const dcaBots = await adminDb
            .collection('dca_bots')
            .where('trading_plan_pair', 'array-contains', trading_plan_id + '_' + pair)
            .where('status', '==', 'ACTIVE')
            .get();
        const dcaBotsData = dcaBots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('dcaBotsData', dcaBotsData);

        const filteredSmartTrade = dcaBotsData.filter((bot) => bot.smart_trade === true);
        console.log('filteredSmartTrade', filteredSmartTrade);

        const response = await Promise.all(dcaBotsData.map(async (bot) => {
            const bodySend = {
                account_id: bot.exchange_external_id,
                pair,
                instant: "true",
                position: {
                    type, // buy or sell (lowercase)
                    units: {
                        value: parseInt(bot.tradeAmount) / price
                    },
                    order_type: "market"
                },
                leverage: {
                    enabled: true,
                    type: "custom",
                    value: "1"
                }
            }
            console.log(`bodySend for exchange ${bot.exchange_external_id} on pair ${pair}`, bodySend);
            return bodySend;
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
            await adminDb.collection('3commas_logs').add({
                createdAt: new Date(),
                pair,
                value: parseInt(bot.tradeAmount) / price,
                type,
                data,
                trading_plan_id,
                result: data
            });
            console.log('Smart trade executed successfully, response:', data);
            return data;
        }))
        return new Response(JSON.stringify({
            status: 'success',
            response,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error in smart trade signal route:', error);
        return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
}
