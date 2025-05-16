import generateSignatureRsa from '@/app/utils/generateSignatureRsa';
import { getMultiplier } from '@/app/utils/getMultiplier';
import { pairNameFor3commas } from '@/app/utils/pairNameFor3commas';
import { adminDb } from '@/lib/firebase-admin-config';
import { NextResponse } from 'next/server';
const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
// const MAX_EXECUTION_RETRIES = 3;

const baseUrl = 'https://api.3commas.io';

export async function POST(request) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization');
        // Extract the token
        const token = authHeader.split(' ')[1];
        const tokenValid = token === 'saslksdlkakASNDNJK#k124nkj if (!authHeader || !authHeader.startsWith("Bearer "")){'
        if (!tokenValid || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Unauthorized - Missing or invalid token' },
                { status: 401 }
            );
        }

        const body = await request.json();
        console.log(body, 'testing smarttrade body');
        const addWebhookResult = await adminDb.collection('webhooks').add({
            ...body,
            action: body?.method === 'DELETE' ? 'cancel' : body?.position?.type ? body?.position?.type?.toUpperCase() : 'unknown', 
            smart_trade: true,
            type: 'autotrade',
            createdAt: new Date(),
            flag: 'testing',
            // result: result.map((x) => x?.status),
        });
        // Process the request
        // TODO: Add your business logic here

        // trading_plan_id is constructed of trading plan name and pair
        const tp_unique_id = body?.trading_plan_id + '_' + body?.pair;

        // initiate
        let autotraders = [];
        let result = null;

        if (body.account_id === 'all') {
        // 1. find active autotraders
        const querySnapshot = await adminDb
            .collection('dca_bots')
            .where('trading_plan_pair', 'array-contains', body.trading_plan_id + '_' + body.pair)
            .where('status', '==', 'ACTIVE')
            .where('smart_trade', '==', true)
            .get();
        if (querySnapshot.empty) {
            console.log(
                `no bots found lookup under ${tp_unique_id} timestamp : `,
                new Date().getTime(),
                JSON.stringify(body)
            );
            return Response.json({ status: false, message: 'No bots foundd' });
        }
        querySnapshot.forEach((doc) => {
            autotraders.push({ ...doc.data(), id: doc.id });
        });

        } else { // specific account_id
            const querySnapshot = await adminDb
            .collection('dca_bots')
            .where('trading_plan_pair', 'array-contains', body.trading_plan_id + '_' + body.pair)
            .where('status', '==', 'ACTIVE')
            .where('smart_trade', '==', true)
            .where(Number(body.account_id))
            .get();
            if (querySnapshot.empty) {
                console.log(
                    `no bots found account id : ${body.account_id} timestamp : `,
                    new Date().getTime(),
                    JSON.stringify(body)
                );
                return Response.json({ status: false, message: 'No bots foundd' });
            }
            querySnapshot.forEach((doc) => {
                autotraders.push({...doc.data(), id: doc.id });
            });
            const res = await Promise.allSettled(autotraders.map(async (autotrader) => {
                return await createSmartTrade({
                    autotrader,
                    body,
                    webhookId :addWebhookResult.id,
                })
            }));
            result = res.map((x) => x.value);
        };







        // CANCEL smart trade

        return NextResponse.json(
            {
                message: 'Success',
                autotraders,
                webhookId: addWebhookResult.id,
                result
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}



async function createSmartTrade({
    autotrader,
    body,
    webhookId,
    pairFromBody,
}) {
    // const payloadExample = {
    //     "account_id": 32455218,
    //     "pair": "USDT_BTC",
    //     "instant": "true",
    //     "position": {
    //         "type": "buy",
    //         "units": {
    //             "value": "0.01"
    //         },
    //         "order_type": "market"
    //     },
    //     "leverage": {
    //         "enabled": true,
    //         "type": "custom",
    //         "value": "12"
    //     }
    // };
    const multiplier = await getMultiplier(body.pair?.split('_')[1], autotrader);
    const payload = {
        "account_id": Number(autotrader.exchange_external_id),
        "position": {
            "type": body.position.type, // buy or sell
            "units": {
                "value": String(
                    parseFloat(autotrader.tradeAmount) /
                    (parseFloat(body.position.price.value) * multiplier)
                )
            },
            "order_type": body.position?.order_type || "market" // limit or market
        },
        "leverage": {
            "enabled": body.leverage?.enabled || false,
            "type": body.leverage?.type || "isolated",
            "value": body.leverage?.value || body.leverage?.value === 'user' ? autotrader?.leverage || 1 : 1,
        },
        "pair": await pairNameFor3commas(autotrader, body.pair), // calculate from pairNameFor3Commas
        "instant":body?.instant || false,
        ...body,
    };
    const signatureMessage = queryParams + JSON.stringify(payload);
    const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
    const queryParams = `/public/api/v2/smart_trades`;
    const finalUrl = baseUrl + queryParams;
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
    const smart_trade_id = String(responseExecute.id || '');
    delete responseExecute.id;
    delete responseExecute.pair;

    // save to 3commas_logs without waiting for it to finish
    const dataToAdd = {
        ...responseExecute,
        status_type: responseExecute?.status?.type || '',
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
        requestBody: payload,
        marketType: autotrader?.marketType || 'unknown',
        webhookId,
    };
    adminDb
        .collection('3commas_logs')
        .add(dataToAdd)
    return { ...responseExecute, smart_trade_id };

}



async function cancelSmartTrade({
    autotrader,
    positionCalculation = "compound",

}) {
    // const payloadExample = {
    //     "account_id": 32455218,
    //     "pair": "USDT_BTC",
    //     "instant": "true",
    //     "position": {
    //         "type": "buy",
    //         "units": {
    //             "value": "0.01"
    //         },
    //         "order_type": "market"
    //     },
    //     "leverage": {
    //         "enabled": true,
    //         "type": "custom",
    //         "value": "12"
    //     }
    // };

    const payload = {
        "account_id": Number(autotrader.exchange_external_id),
        "pair": "USDT_BTC",
        "instant": "true",
        "position": {
            "type": "buy",
            "units": {
                "value": "0.01"
            },
            "order_type": "market"
        },
        "leverage": {
            "enabled": true,
            "type": "custom",
            "value": "12"
        }
    };


}

async function closeAtMarketPrice({
    autotrader,
    positionCalculation = "compound",

}) {
    // const payloadExample = {
    //     "account_id": 32455218,
    //     "pair": "USDT_BTC",
    //     "instant": "true",
    //     "position": {
    //         "type": "buy",
    //         "units": {
    //             "value": "0.01"
    //         },
    //         "order_type": "market"
    //     },
    //     "leverage": {
    //         "enabled": true,
    //         "type": "custom",
    //         "value": "12"
    //     }
    // };

    const payload = {
        "account_id": Number(autotrader.exchange_external_id),
        "pair": "USDT_BTC",
        "instant": "true",
        "position": {
            "type": "buy",
            "units": {
                "value": "0.01"
            },
            "order_type": "market"
        },
        "leverage": {
            "enabled": true,
            "type": "custom",
            "value": "12"
        }
    };


}