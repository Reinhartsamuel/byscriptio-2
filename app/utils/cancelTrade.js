import { adminDb } from "@/lib/firebase-admin-config";
import generateSignatureRsa from "./generateSignatureRsa";
const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';
export async function cancelTrade ({
    body,
    autotrader
}) {
    try {
        if (!autotrader.id) return {message: 'autotrader id undefined', body}
        // 1. get the logs
        let historyLogs = [];
        const querySnapshot = await adminDb
        .collection('3commas_logs')
        .where('autotrader_id', '==', autotrader.id)
        .where('pair', '==', body.pair)
        .where('trading_plan_id', '==', body.trading_plan_id)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();

        querySnapshot.forEach((doc) => {
            historyLogs.push({...doc.data(), id: doc.id });
        });


        // only cancel those with "waiting_position" status.type
        historyLogs = historyLogs.filter((item) => {
            return item.status?.type === 'waiting_position';
        })
        const resPromise = await Promise.allSettled(historyLogs.map(async (item) => {
            console.log(`cancelling trade ${item.smart_trade_id}, autotrader_id ${item.autotrader_id}, pair: ${item.pair}, trading_plan_id: ${item.trading_plan_id}`)
            const totalParams = '/public/api' + `/v2/smart_trades/${item.smart_trade_id}`;
            const finalUrl = baseUrl + totalParams;
            const signature = generateSignatureRsa(PRIVATE_KEY, totalParams);
            const response = await fetch(finalUrl, {
                method: 'DELETE',
                body: body.bodySend ? JSON.stringify(body.bodySend) : null,
                headers: {
                    'Content-Type': 'application/json',
                    APIKEY: API_KEY,
                    Signature: signature,
                }
            });
            return await response.json();
        }))
        return resPromise.map((x) => x.value);
    } catch (error) {
        console.log(error.message, 'error cancelling trade', `body: ${JSON.stringify(body)}, autotrader_id : ${autotrader.id}, pair: ${body.pair}, trading_plan_id: ${body.trading_plan_id}`)
        return {error: error.message, message : 'error cancelling trade', body, autotrader};
    }
}