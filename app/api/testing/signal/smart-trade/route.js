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
        // // Get authorization header
        // const authHeader = request.headers.get('authorization');
        // // Extract the token
        // const token = authHeader.split(' ')[1];
        // const tokenValid = token === 'saslksdlkakASNDNJK#k124nkj if (!authHeader || !authHeader.startsWith("Bearer "")){'
        // if (!tokenValid || !authHeader.startsWith('Bearer ')) {
        //     return NextResponse.json(
        //         { error: 'Unauthorized - Missing or invalid token' },
        //         { status: 401 }
        //     );
        // }

        const body = await request.json();
        // console.log(body, 'testing smarttrade body');
        const addWebhookResult = await adminDb.collection('webhooks').add({
            ...body,
            action: body?.method === 'DELETE' ? 'cancel' : body?.position?.type ? body?.position?.type?.toUpperCase() : 'unknown',
            smart_trade: true,
            type: 'autotrade',
            createdAt: new Date(),
            flag: 'testing',
            rawSignal: JSON.stringify(body),
            // result: result.map((x) => x?.status),
        });

        // trading_plan_id is constructed of trading plan name and pair
        const tp_unique_id = body?.trading_plan_id + '_' + body?.pair;

        // initiate
        let autotraders = [];
        let result = null;


        if (body.method === 'CANCEL') {
            return await cancelSmartTrade({
                body,
                webhookId: addWebhookResult.id,
            });
        } else if (body.method === 'CLOSE') {
            return await closeAtMarketPrice({
                body,
                webhookId: addWebhookResult.id,
            });
        }

        //1. Build the query
        let query = adminDb
            .collection('dca_bots')
            .where('trading_plan_pair', 'array-contains', body.trading_plan_id + '_' + body.pair)
            .where('status', '==', 'ACTIVE')
            .where('smart_trade', '==', true);

        // 2. Conditionally add `account_id` filter if it's not 'all'
        if (body.account_id !== 'all') {
            query = query.where('exchange_external_id', '==', Number(body.account_id));
        }
        const querySnapshot = await query.get();
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
        console.log(autotraders.length, 'length')

        const res = await Promise.allSettled(autotraders.map(async (autotrader) => {
            const resultCreateSmartTrade = await createSmartTrade({
                autotrader,
                body,
                webhookId: addWebhookResult.id,
            });
            console.log("resultCreateSmartTrade:::", resultCreateSmartTrade, JSON.stringify(body));
            return resultCreateSmartTrade;
        }));
        result = res.map((x) => x.value);

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
    //     "compound": "false",
    //     "flag": "testing"
    // };
    const multiplier = await getMultiplier(body.pair?.split('_')[1], autotrader);
    const payload = {
        ...body,
        "account_id": Number(autotrader.exchange_external_id),
        "position": {
            "type": body.position.type, // buy or sell
            "units": {
                "value": String(
                    parseFloat(autotrader.tradeAmount) /
                    (parseFloat(body.position.price.value) * multiplier)
                )
            },
            "order_type": body.position?.order_type || "market", // limit or market,
            "price" : body.position?.price 
        },
        "leverage": {
            "enabled": body.leverage?.enabled || false,
            "type": body.leverage?.type || "isolated",
            "value": body.leverage?.value || body.leverage?.value === 'user' ? autotrader?.leverage || 1 : 1,
        },
        "pair": await pairNameFor3commas(autotrader, body.pair), // calculate from pairNameFor3Commas
        "instant": body?.instant || false,
    };
    console.log(payload, 'payloadddddd');
    const queryParams = `/public/api/v2/smart_trades`;
    const signatureMessage = queryParams + JSON.stringify(payload);
    console.log(signatureMessage, 'signatureMessageddddd');
    const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
    // console.log(signature, 'signatureddddd');
    const finalUrl = baseUrl + queryParams;
    console.log('finalUrl:::', finalUrl);
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
    console.log('responseExecute:::', responseExecute, JSON.stringify(body));
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
    console.log(dataToAdd, 'dataToAdd', JSON.stringify(body))
    adminDb
        .collection('3commas_logs')
        .add(dataToAdd)
    return { ...responseExecute, smart_trade_id };
}



async function cancelSmartTrade({
    body,
    webhookId
}) {
    // const exampleBody = {
    //     "account_id": "all",
    //     "pair": "USDT_SOL",
    //     "method": "CANCEL",
    //     "trading_plan_id": "GRID_CUANTERUS",
    //     "market_type": "futures",
    //     "timestamp": "' + str.tostring(timenow) + '",
    //     "status": "waiting_position",
    //     "flag": "testing"
    // }
    try {
        let tradesHistory = [];
        // build query
        let query = adminDb
            .collection('3commas_logs')
            .where('trading_plan_id', '==', body.trading_plan_id)
            .where('pair', '==', body.pair)
            .where('status_type', '==', body.status);

        if (body.account_id !== 'all') {
            query = query.where('exchange_external_id', '==', Number(body.account_id));
        }



        const querySnapshot = await query.get();
        if (querySnapshot.empty) {
            console.log(
                `no trades found lookup under ${body.trading_plan_id} timestamp : `,
                new Date().getTime(),
                JSON.stringify(body)
            );
            return Response.json({ status: false, message: 'No trades found' });
        }
        querySnapshot.forEach((doc) => {
            tradesHistory.push({ ...doc.data(), id: doc.id });
        })


        const resPromise = await Promise.allSettled(tradesHistory.map(async (item) => {
            const doc = await adminDb
                .collection('dca_bots')
                .doc(item.autotrader_id)
                .get();
            const autotrader = { ...doc.data(), id: doc.id };
            console.log(`cancelling trade ${item.smart_trade_id}, autotrader_id ${item.autotrader_id}, pair: ${item.pair}, trading_plan_id: ${item.trading_plan_id}`)
            const totalParams = '/public/api' + `/v2/smart_trades/${item.smart_trade_id}`;
            const finalUrl = baseUrl + totalParams;
            const signature = generateSignatureRsa(PRIVATE_KEY, totalParams);
            const response = await fetch(finalUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    APIKEY: API_KEY,
                    Signature: signature,
                }
            });
            const responseCancel = await response.json();
            const smart_trade_id = String(responseCancel.id || '');
            const dataWithoutId = delete responseCancel.id;
            const sendDataTo3CommasLogs = {
                ...dataWithoutId,
                status_type: dataWithoutId?.status?.type || '',
                name: autotrader?.name || '',
                email: autotrader?.email || '',
                uid: autotrader?.uid || '',
                smart_trade_id,
                autotrader_id: autotrader.id,
                createdAt: new Date(),
                exchange_external_id: autotrader?.exchange_external_id || '',
                exchange_name: autotrader?.exchange_name || '',
                exchange_thumbnail: autotrader?.exchange_thumbnail || '',
                type: 'autotrade',
                trading_plan_id: body.trading_plan_id,
                action: `CANCEL_${item?.action}`,
                pair: body.pair,
                previousBuyId: item?.id || '',
                smart_trade: true,
                marketType: autotrader?.marketType || 'unknown',
                webhookId
            };

            adminDb
                .collection('3commas_logs')
                .add(sendDataTo3CommasLogs)
            return sendDataTo3CommasLogs;
        }))
        console.log(resPromise.map((x) => x.value), `\n====== result cancelling trade ======, body: ${JSON.stringify(body)}`);
        return NextResponse.json(
            {
                message: 'Success',
                tradesHistory,
                result: resPromise.map((x) => x.value),
            },
            { status: 200 }
        )
    } catch (error) {
        console.log(error.message, `\n====== Error in cancelSmartTrade ======, body: ${JSON.stringify(body)}`);
        return NextResponse.json(
            { error: 'Internal Server Error', errorMessage: error.message, message: error.message, },
            { status: 500 }
        );
    }
}

async function closeAtMarketPrice({
    body,
    webhookId
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
    //     "method": "CLOSE",
    //     "trading_plan_id": "GRID_CUANTERUS",
    //     "market_type": "futures",
    //     "timestamp": "' + str.tostring(timenow) + '",
    //     "compound": "false",
    //     "flag": "testing"
    // };

    try {
        let tradesHistory = [];
        // build query
        let query = adminDb
            .collection('3commas_logs')
            .where('trading_plan_id', '==', body.trading_plan_id)
            .where('pair', '==', body.pair)
            .where('status_type', '==', 'waiting_targets');

        if (body.account_id !== 'all') {
            query = query.where('exchange_external_id', '==', Number(body.account_id));
        }

        const querySnapshot = await query.get();
        if (querySnapshot.empty) {
            console.log(
                `no trades found lookup under ${body.trading_plan_id} timestamp : `,
                new Date().getTime(),
                JSON.stringify(body)
            );
            return Response.json({ status: false, message: 'No trades found' });
        }
        querySnapshot.forEach((doc) => {
            tradesHistory.push({ ...doc.data(), id: doc.id });
        })


        const resPromise = await Promise.allSettled(tradesHistory.map(async (item) => {
            const doc = await adminDb
                .collection('dca_bots')
                .doc(item.autotrader_id)
                .get();
            const autotrader = { ...doc.data(), id: doc.id };
            console.log(`cancelling trade ${item.smart_trade_id}, autotrader_id ${item.autotrader_id}, pair: ${item.pair}, trading_plan_id: ${item.trading_plan_id}`)
            const queryParamsCloseMarket = `/public/api/v2/smart_trades/${item.smart_trade_id}/close_by_market`;
            console.log(`queryParamsCloseMarket: ${queryParamsCloseMarket}`)
            const finalUrlCloseMarket = baseUrl + queryParamsCloseMarket;
            const signatureMessage = queryParamsCloseMarket;
            const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
            const response2 = await fetch(finalUrlCloseMarket, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    APIKEY: API_KEY,
                    Signature: signature,
                }
            });
            const responseCloseMarket = await response2.json();
            console.log(responseCloseMarket, 'responseCloseMarket cuyyy', `accountId:${autotrader?.exchange_external_id}, user : ${autotrader.name}`);
            const smart_trade_id = String(responseCloseMarket.id || '');
            delete responseCloseMarket.id;
            // this is for adding 3commas_logs
            const sendDataTo3CommasLogs = {
                ...responseCloseMarket,
                status_type: responseCloseMarket?.status?.type || '',
                name: autotrader?.name || '',
                email: autotrader?.email || '',
                uid: autotrader?.uid || '',
                smart_trade_id,
                autotrader_id: autotrader.id,
                createdAt: new Date(),
                exchange_external_id: autotrader?.exchange_external_id || '',
                exchange_name: autotrader?.exchange_name || '',
                exchange_thumbnail: autotrader?.exchange_thumbnail || '',
                type: 'autotrade',
                trading_plan_id: body.trading_plan_id,
                action: `CLOSE_${item.action}`,
                pair: body?.pair || '',
                previousBuyId: item?.id || '',
                smart_trade: true,
                requestBody: null,
                marketType: autotrader?.marketType || 'unknown',
                webhookId
            }

            if (body?.compound) {
                const updatedTradeAmount = parseFloat(autotrader) + parseFloat(item?.profit?.usd);
                if (!isNaN(updatedTradeAmount)) {
                    // update tradeAmount without waiting
                    adminDb
                        .collection('dca_bots')
                        .doc(autotrader.id)
                        .update({
                            tradeAmount: updatedTradeAmount
                        }).catch((error) => {
                            console.log(error.message, `error updating autotrader tradeAmount for smart_trade_id ${smart_trade_id}`, JSON.stringify(body));
                        });
                }
            }
            delete responseCloseMarket.pair;
            adminDb.collection('3commas_logs').add(sendDataTo3CommasLogs);
            return sendDataTo3CommasLogs;
        }));
        console.log(resPromise.map((x) => x.value), `\n====== result close market price ======, body: ${JSON.stringify(body)}`);
        return NextResponse.json(
            {
                message: 'Success',
                tradesHistory,
                result: resPromise.map((x) => x.value),
            },
            { status: 200 }
        )
    } catch (error) {
        console.log(error.message, `\n====== Error in closeat marketprice ======, body: ${JSON.stringify(body)}`);
        return NextResponse.json(
            { error: 'Internal Server Error', errorMessage: error.message, message: error.message, },
            { status: 500 }
        );
    }
}