import { adminDb } from "@/lib/firebase-admin-config";
import generateSignatureRsa from "./generateSignatureRsa";

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
// const MAX_EXECUTION_RETRIES = 3;

const baseUrl = 'https://api.3commas.io';
export async function executeNewTrade({
    bodySend,
    body,
    // nonce,
    updateTradeAmount,
    autotrader,
    webhookId,
    pairFromBody
}) {
    const queryParams = `/public/api/v2/smart_trades`;
    const finalUrl = baseUrl + queryParams;
    const signatureMessage = queryParams + JSON.stringify(bodySend);
    const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
    const updatedBodySend = {
        ...bodySend,
        position: {
            ...bodySend.position,
            units: {
                value: updateTradeAmount ? String(updateTradeAmount) : bodySend.position.units.value // check if the previous trade updates the tradeAmount, otherwise use the original tradeAmount
            }
        }
    }
    console.log(`executinggggggggg ${JSON.stringify(updatedBodySend)}`)
    // return {pepek : 'anjing'}
    const response2 = await fetch(finalUrl, {
        method: 'POST',
        body: JSON.stringify(updatedBodySend),
        headers: {
            'Content-Type': 'application/json',
            APIKEY: API_KEY,
            Signature: signature,
        }
    });
    const responseExecute = await response2.json();
    // result of execute smart trade, update to 3commas_logs
    // if error, return error and console log
    if (responseExecute.error || responseExecute.error_description) {
        console.log('Failed to execute smart trade', responseExecute, 'payload:', JSON.stringify(updatedBodySend));
        // if (nonce <= MAX_EXECUTION_RETRIES) {
        //     console.log('retrying execute smart trade', nonce);
        //     return await executeNewTrade({
        //         bodySend,
        //         body,
        //         nonce: nonce + 1,
        //         updateTradeAmount,
        //         webhookId
        //     }); // retry MAX_EXECUTION_RETRIES times
        // }
    }
    const smart_trade_id = String(responseExecute.id || '');
    delete responseExecute.id;
    delete responseExecute.pair;

    // save to 3commas_logs without waiting for it to finish
    const dataToAdd = {
        ...responseExecute,
        status_type : responseExecute?.status?.type || '',
        name: autotrader?.name || '',
        email: autotrader?.email || '',
        uid: autotrader?.uid || '',
        exchange_thumbnail: autotrader?.exchange_thumbnail || '',
        exchange_name: autotrader?.exchange_name || '',
        exchange_external_id: autotrader?.exchange_external_id || '',
        smart_trade_id,
        autotrader_id: autotrader.id,
        createdAt: new Date(),
        trading_plan_id: body.trading_plan_id,
        action: body.type === 'sell' ? 'SELL' : 'BUY',
        type: 'autotrade',
        pair: pairFromBody,
        smart_trade: true,
        requestBody: bodySend,
        marketType: autotrader?.marketType || 'unknown',
        webhookId,
    };
    adminDb
        .collection('3commas_logs')
        .add(dataToAdd)
    return { ...responseExecute, smart_trade_id };
}