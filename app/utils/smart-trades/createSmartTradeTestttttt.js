import { adminDb } from "@/lib/firebase-admin-config";
import generateSignatureRsa from "../generateSignatureRsa";
import { getMultiplier } from "../getMultiplier";
import { pairNameFor3commas } from "../pairNameFor3commas";

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;

const baseUrl = 'https://api.3commas.io';
export async function createSmartTradeTestttttt({
    autotrader,
    body,
    webhookId,
    pairFromBody,
}) {
    // const exampleBody = {
    //     "account_id": "all",
    //     "pair": "USDT_SOL",
    //     "position": {
    //         "type": "buy",
    //         "order_type": "limit",
    //         "units": {
    //             "value": "trade_amount"
    //         },
    //         "price": {
    //             "value": "' + str.tostring(limit_entry_buy) + '"
    //         }
    //     },
    //     "leverage": {
    //         "enabled": true,
    //         "type": "custom",
    //         "value": "1"
    //     },
    //     "take_profit": {
    //         "enabled": true,
    //         "steps": [
    //             {
    //                 "order_type": "limit",
    //                 "volume": "100",
    //                 "price": {
    //                     "value": "' + str.tostring(limit_entry_price) + '",
    //                     "type": "last"
    //                 }
    //             }
    //         ]
    //     },
    //     "stop_loss": {
    //         "enabled": false
    //     },
    //     "method": "CREATE",
    //     "trading_plan_id": "GRID_CUANTERUS",
    //     "market_type": "futures",
    //     "timestamp": "' + str.tostring(timenow) + '",
    //     "flag": "testing"
    // };
    const multiplier = await getMultiplier(body.pair?.split('_')[1], autotrader);
    const payload = {
        ...body,
        "account_id": Number(autotrader.exchange_external_id),
        "position": {
            "type": body.position.type, // buy or sell
            "units": {
                "value": !isNaN(body.position?.units?.value) ? String(      // if trade amount is fixed from
                    parseFloat(body.position?.units?.value) /               //
                    (parseFloat(body.position.price.value) * multiplier)    //
                ) :
                    String(
                        parseFloat(autotrader.tradeAmount) /
                        (parseFloat(body.position.price.value) * multiplier)
                    )
                // "value" : parseFloat(autotrader.tradeAmount)
            },
            "order_type": body.position?.order_type || "market", // limit or market,
            "price": body.position?.price
        },
        "leverage": {
            "enabled": body.leverage?.enabled || false,
            "type": body.leverage?.type || "isolated",
            "value":body.leverage?.enabled && body.leverage?.value ? body?.leverage?.value : 
            body.leverage?.value === 'user' ? autotrader?.leverage || 1 : 1,
        },
        "pair": await pairNameFor3commas(autotrader, body.pair), // calculate from pairNameFor3Commas
        "instant": body?.instant || false,
    };
    console.log(payload, 'payloadddddd');
    const queryParams = `/public/api/v2/smart_trades`;
    const signatureMessage = queryParams + JSON.stringify(payload);
    // console.log(signatureMessage, 'signatureMessageddddd');
    const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
    // console.log(signature, 'signatureddddd');
    const finalUrl = baseUrl + queryParams;
    // console.log('finalUrl:::', finalUrl);
    const response2 = await fetch(finalUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            APIKEY: API_KEY,
            Signature: signature,
        }
    });
    const responseExecute = await response2.json();
    // console.log('responseExecute:::', responseExecute, JSON.stringify(body));
    const smart_trade_id = String(responseExecute.id || '');
    delete responseExecute.id;
    delete responseExecute.pair;
    const safeCopy = JSON.parse(JSON.stringify(responseExecute));

    // save to 3commas_logs without waiting for it to finish
    const dataToAdd = {
        ...safeCopy,
        status_type: safeCopy?.status?.type || '',
        name: autotrader?.name || '',
        email: autotrader?.email || '',
        uid: autotrader?.uid || '',
        exchange_thumbnail: autotrader?.exchange_thumbnail || '',
        exchange_name: autotrader?.exchange_name || '',
        exchange_external_id: autotrader?.exchange_external_id || '',
        autotrader_id: autotrader.id,
        createdAt: new Date(),
        trading_plan_id: body.trading_plan_id,
        action: body.position?.type !== undefined ? body.position?.type?.toUpperCase() : 'unknown',
        type: 'autotrade',
        smart_trade: true,
        requestBody: payload,
        marketType: autotrader?.marketType || 'unknown',
        autocompound: autotrader?.autocompound || false,
        webhookId,
    };
    delete dataToAdd.pair;
    dataToAdd.pair = pairFromBody;
    dataToAdd.smart_trade_id = smart_trade_id

    const added = await adminDb
        .collection('3commas_logs')
        .add(dataToAdd);

    console.log(`added to 3commas_logs ${added.id}`)
    return { ...responseExecute, smart_trade_id };
}