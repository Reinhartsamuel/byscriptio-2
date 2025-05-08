import generateSignatureRsa from "@/app/utils/generateSignatureRsa";
import { adminDb } from "@/lib/firebase-admin-config";

// const example = {
//     "pair": "USDT_BTC",
//     "trading_plan_id": "CUANTERUS"
// }
const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';

export async function POST(request) {
    const body = await request.json();
    try {
        // get all history from 3commas_logs
        const historyTrades = [];

        const querySnapshot = await adminDb
            .collection('3commas_logs')
            .where('trading_plan_id', '==', body)
            .where('pair', '==', body.pair)
            .where('status_type', '==', 'waiting_targets')
            .orderBy('createdAt', 'desc')
            .get();
        querySnapshot.forEach((doc) => {
            historyTrades.push({ ...doc.data(), id: doc.id });
        });

        const resPromise = await Promise.all(historyTrades.mapa(async (trade) => {
            const queryParams = `/public/api/v2/smart_trades/${trade.smart_trade_id}/close_by_market`;
            // const queryParams = `/public/api/v2/smart_trades/${id}/close_by_market`;
            const finalUrl = baseUrl + queryParams;
            const signatureMessage = queryParams;
            const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);

            const response2 = await fetch(finalUrl, {
                method: 'POST',
                // body: JSON.stringify({}),
                headers: {
                    'Content-Type': 'application/json',
                    APIKEY: API_KEY,
                    Signature: signature,
                }
            });
            return await response2.json();
        }))
        console.log(resPromise, `close returndata on ${body.pair} ${body.trading_plan_id}`)
        return Response.json({
            status : 'success',
            data : resPromise
        })
    } catch (error) {
        console.log(`error on close all trade ${error.message}, pair : ${body.pair}, trading_plan_id : ${body.trading_plan_id}`)
        return Response.json({
            status: false,
            message: error.message,
        })
    }

}