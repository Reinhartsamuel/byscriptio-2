import { coins } from "@/app/dummy";
// import tradeExecutedTemplate from "@/app/utils/emailHtmlTemplates/tradeExecutedTemplate";
import generateSignatureRsa from "@/app/utils/generateSignatureRsa";
import { adminDb } from "@/lib/firebase-admin-config";
import { FieldValue } from "firebase-admin/firestore";
import moment from "moment";

// const example = {
//     pair: 'USDT_BTC',
//     type: 'buy',
//     price: 80000,
//     trading_plan_id: 'XMA',
//     timeframe : '4h',
//     timestamp: 1700000000
// };

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const MAX_EXECUTION_RETRIES = 3;

const telegram_bot_token = process.env.TELEGRAM_BOT_TOKEN;
const baseUrl = 'https://api.3commas.io';


export const maxDuration = 60; // This function can run for a maximum of 60 seconds 


export async function POST(request) {
    try {
        const body = await request.json();
        try {
            const messageTelegram = `pair: ${body?.pair} SMART TRADE SIGNAL \n price: ${body?.price} \n timeframe: ${body?.time_frame} \n timestamp: ${body?.timestamp} \n date: ${moment.unix(body?.timestamp).format('DD-MM-YYYY HH:mm')} \n action: ${body?.type?.toUpperCase()} \n trading_plan_id: ${body?.trading_plan_id}`
            fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
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
            // const resTelegram = await res.json();
            // console.log(resTelegram, 'resTelegram')
        } catch (error) {
            console.log(error.message + ' :::error sending to telegram' + JSON.stringify(body))
        }

        // saving image to firestore
        try {
            const ticker = body?.pair?.split('_')[1];
            // find in dummy data
            const foundInDummy = coins.filter((x) => x?.symbol === ticker);
            if (
                Array.isArray(foundInDummy) && foundInDummy?.length === 0
            ) {
                //get logo from coingecko
                const fetchList = await fetch('https://api.coingecko.com/api/v3/coins/list', {
                    headers: {
                        accept: 'application/json',
                        'x-cg-api-key': process.env.COINGECKO_API_KEY
                    }
                });
                const fetchListResult = await fetchList.json();

                const obj = fetchListResult?.find((coin) => coin.symbol === ticker.toLowerCase());
                const id = obj.id;
                const fetchCoin = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`, {
                    headers: {
                        accept: 'application/json',
                        'x-cg-api-key': process.env.COINGECKO_API_KEY
                    }
                });
                const result = await fetchCoin.json();

                //save to firestore without waiting
                adminDb
                    .collection('logos')
                    .doc(ticker)
                    .set({
                        image: result?.image?.small
                    })
            } else {
                // console.log({
                //     message: `crypto logo already exist in dummy, ticker : ${ticker}`,
                // })
            }
        } catch (error) {
            console.log(error.message, 'error saving crypto logos to firestore', JSON.stringify(body))
        }
        const addWebhookResult = await adminDb.collection('webhooks').add({
            ...body,
            action: body?.type === 'sell' ? 'SELL' : 'BUY',
            smart_trade: true,
            type: 'autotrade',
            createdAt: new Date(),
            flag: body?.flag || '',
            // result: result.map((x) => x?.status),
        });

        // trading_plan_id is constructed of trading plan name and pair
        const tp_unique_id = body?.trading_plan_id + '_' + body?.pair;

        // check if trading plan pair exists on database
        // if not, create
        const doc = await adminDb
            .collection('trading_plan_pair')
            .doc(tp_unique_id)
            .get();
        if (!doc.exists) {
            try {
                // console.log(
                //     `No such document! id ::: ${body?.trading_plan_id || ''
                //     }, timestamp : `,
                //     new Date().getTime(),
                //     'creating',
                //     tp_unique_id
                // );
                adminDb.collection('trading_plan_pair').doc(tp_unique_id).set({
                    bots_id: [],
                    createdAt: new Date(),
                    lastUpdated: new Date(),
                    pair: body?.pair,
                    trading_plan_id: body.trading_plan_id,
                }).catch(error => {
                    console.error('Error creating trading plan pair:', error, JSON.stringify(body));
                });
                const tradingPlanDoc = await adminDb
                    .collection('trading_plan')
                    .doc(body.trading_plan_id)
                    .get();

                if (!tradingPlanDoc.exists) {
                    // console.log(
                    //     `trading plan not found, creating ID : ${body.trading_plan_id}`
                    // );
                    adminDb
                        .collection('trading_plans')
                        .doc(body.trading_plan_id)
                        .set({
                            id: body?.trading_plan_id || '',
                            name: body?.trading_plan_id || '',
                            childrenPairs: FieldValue.arrayUnion(body?.pair),
                            createdAt: new Date(),
                        }).catch((error) => {
                            console.error('Error creating trading plan:', error);
                        })
                }
                console.log('no bots!', new Date().getTime())
                return new Response('no bots!', {
                    status: 400,
                });
            } catch (error) {
                console.log(error.message);
            }
        }

        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        if (body?.flag === 'testing') {
            console.log(`returning because of testinggg, ${JSON.stringify(body)}`)
            return new Response(
                JSON.stringify({
                    status: true,
                }),
                {
                    status: 200,
                }
            );
        }
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG
        // RETURN IF THERE'S TESTING FLAG

        // ----------------------------------------------------------------------------
        // ----------------------------------------------------------------------------
        // ----------------------------------------------------------------------------
        // 1. find active autotraders
        let autotraders = [];
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
        })

        // console.log(autotraders, 'autotraders');
        // return Response.json({
        //     status: true,
        //     message: 'Signal received',
        //     autotraders,
        //     body
        // })

        const resultPromise = await Promise.allSettled(autotraders.map(async (autotrader) => {
            // console.log(autotrader, 'autotrader kuda')
            const bodySend = {
                account_id: autotrader.exchange_external_id,
                pair: body.pair,
                instant: false,
                position: {
                    type: body.type,
                    units: {
                        value: String(parseFloat(autotrader.tradeAmount) / parseFloat(body.price)) // amount in token, not in usd, so (amountUsd/price)
                    },
                    order_type: "market"
                },
                leverage: {
                    enabled: true,
                    type: "isolated",
                    value: "1"
                },
                take_profit: {
                    enabled: false,
                },
                stop_loss: {
                    enabled: false,
                },
            }

            // 2. find latest trade history on 3commas_logs where same trading_plan_id and pair
            const responseCloseMarket = await closePreviousTrade({
                body,
                bodySend,
                autotrader,
                webhookId: addWebhookResult.id,
            });

            // 4. execute smart trade
            // console.log(`Executing smart trade for ${autotrader.id}`)
            const responseExecute = await executeNewTrade({
                bodySend,
                body,
                nonce: 1,
                updateTradeAmount: responseCloseMarket?.updateTradeAmount,
                autotrader,
                webhookId: addWebhookResult.id,
            })


            const returnValue = {
                ...autotrader,
                // latestTradeHistory,
                responseExecute,
                responseCloseMarket,
            }
            console.log(returnValue, 'returnValue', JSON.stringify(body))
            return returnValue;
        }));

        // //------------------------------ SEND EMAIL ------------------------------  
        // //------------------------------ SEND EMAIL ------------------------------
        // resultPromise.map((x) => x?.value).map(async (result) => {
        //     if (result?.responseCloseMarket?.status.type === 'panic_sell_pending') {
        //         //send email
        //         const emailBody = {
        //             sender: {
        //                 name: 'byScript.io',
        //                 email: 'info@byscript.io',
        //             },
        //             to: [
        //                 {
        //                     email: result?.email || '',
        //                     name: result?.name || '',
        //                 },
        //             ],
        //             subject: `Trade Executed ${body?.pair || ''} - byScript`,
        //             htmlContent: tradeExecutedTemplate({
        //                 autotrader_name: result.id,
        //                 exchange_thumbnail: result?.exchange_thumbnail || '',
        //                 trading_plan_id: body?.trading_plan_id,
        //                 signal_type: body?.type === 'sell' ? 'CLOSE_SELL' : 'CLOSE_BUY',
        //                 tradeAmount: result?.tradeAmount || '-',
        //                 price: body?.price || '',
        //                 pair: body?.pair || '',
        //             }),
        //         };
        //         fetch('https://api.brevo.com/v3/smtp/email', {
        //             method: 'post',
        //             body: JSON.stringify(emailBody),
        //             headers: {
        //                 accept: 'application/json',
        //                 // eslint-disable-next-line no-undef
        //                 'api-key': process.env.BREVO_API_KEY,
        //                 'content-type': 'application/json',
        //             },
        //         });
        //     }

        //     if (result?.responseExecute?.status.type === 'created') {
        //         //send email
        //         const emailBody = {
        //             sender: {
        //                 name: 'byScript.io',
        //                 email: 'info@byscript.io',
        //             },
        //             to: [
        //                 {
        //                     email: result?.email || '',
        //                     name: result?.name || '',
        //                 },
        //             ],
        //             subject: `Trade Executed ${body?.pair || ''} - byScript`,
        //             htmlContent: tradeExecutedTemplate({
        //                 autotrader_name: result.id,
        //                 exchange_thumbnail: result?.exchange_thumbnail || '',
        //                 trading_plan_id: body?.trading_plan_id,
        //                 signal_type: body?.type === 'sell' ? 'SELL' : 'BUY',
        //                 tradeAmount: result?.tradeAmount || '-',
        //                 price: body?.price || '',
        //                 pair: body?.pair || '',
        //             }),
        //         };
        //         fetch('https://api.brevo.com/v3/smtp/email', {
        //             method: 'post',
        //             body: JSON.stringify(emailBody),
        //             headers: {
        //                 accept: 'application/json',
        //                 // eslint-disable-next-line no-undef
        //                 'api-key': process.env.BREVO_API_KEY,
        //                 'content-type': 'application/json',
        //             },
        //         });
        //     }
        // })

        console.log(`returning successfully : {JSON.stringify({
            status : true, message : 'signal received', result : resultPromise.map((x) => x?.value)})}: 
            ${JSON.stringify({
            status: true,
            message: 'signal received',
            result: resultPromise.map((x) => x?.value)
        }
        )}`)
        return Response.json({
            status: true,
            message: 'Signal received',
            // body,
            result: resultPromise.map((x) => x?.value) // this is mock result

        })
    } catch (error) {
        const body = await request.json();
        console.log(error.message, 'error smart trade', JSON.stringify(body))
        return new Response(JSON.stringify({
            status: false,
            message: error.message,
            error
        }), {
            status: 500
        })
    }
}

async function getStmartTradeStatus(id) {
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
        status: data.status,
        id
    }
}


async function closePreviousTrade({
    body,
    bodySend,
    autotrader,
    webhookId
}) {
    let arr = [];
    try {
        const latestTradeHistory = await adminDb
            .collection('3commas_logs')
            .where('autotrader_id', '==', autotrader.id)
            .where('pair', '==', body.pair)
            .where('trading_plan_id', '==', body.trading_plan_id)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
        latestTradeHistory.forEach((doc) => {
            arr.push({ ...doc.data(), id: doc.id });
        })
        //instead of fetching the firestore database, fetch from local file in this same directory, from "data"
        // arr = mockDatabase.filter((item) => {
        //     return item.pair === body.pair &&
        //         item.trading_plan_id === body.trading_plan_id;
        // }).sort((a, b) => {
        //     return new Date(parseInt(b.createdAt)) - new Date(parseInt(a.createdAt));
        // });
    } catch (error) {
        console.log(error.message, 'error finding latest trade history on 3commas_logs where same trading_plan_id and pair', JSON.stringify(body));
        return null;
    }

    // 3. if the latest trade history is not closed, close first
    // by close_at_market_price function
    if (
        arr.length > 0 &&
        arr[0].status.type
        !== 'panic_sell_pending' && arr[0].status.type !== 'panic_sold') {
        // check status of the latest trade history
        const { status } = await getStmartTradeStatus(arr[0].smart_trade_id);
        console.log(status, arr[0].smart_trade_id, 'this is status weve longing for');
        if (status?.type !== 'panic_sold') {

            console.log(`found ${arr[0].smart_trade_id} trade, trying to close first`);
            console.log(`trying to close trade ${arr[0].smart_trade_id}`)
            // close at market price function here
            // console.log(`trying to close trade ${arr[0].smart_trade_id}`)
            const queryParamsCloseMarket = `/public/api/v2/smart_trades/${arr[0].smart_trade_id}/close_by_market`;
            console.log(`queryParamsCloseMarket: ${queryParamsCloseMarket}`)
            const finalUrlCloseMarket = baseUrl + queryParamsCloseMarket;
            const signatureMessage = queryParamsCloseMarket;
            const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
            const response2 = await fetch(finalUrlCloseMarket, {
                method: 'POST',
                // body: JSON.stringify({}),
                headers: {
                    'Content-Type': 'application/json',
                    APIKEY: API_KEY,
                    Signature: signature,
                }
            });
            const responseCloseMarket = await response2.json();
            if (responseCloseMarket.error || responseCloseMarket.error_description) {
                console.log('Failed to close trade', responseCloseMarket, JSON.stringify(body));
                throw new Error('Failed to close trade');
            }
            const smart_trade_id = String(responseCloseMarket.id || '');
            delete responseCloseMarket.id;
            // this is for adding 3commas_logs
            const sendDataTo3CommasLogs = {
                ...responseCloseMarket,
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
                action: `CLOSE_${arr[0].action}`,
                pair: body.pair,
                previousBuyId: arr[0]?.id || '',
                smart_trade: true,
                requestBody: JSON.stringify(bodySend),
                webhookId
            }
            const updateTradeAmount = parseFloat(responseCloseMarket.margin.amount) + parseFloat(responseCloseMarket.profit.usd);
            console.log(updateTradeAmount, 'updateTradeAmount')
            if (!isNaN(updateTradeAmount)) {
                bodySend.position.units.value = String(updateTradeAmount);
                sendDataTo3CommasLogs.updatedBalance = updateTradeAmount;

                // update tradeAmount without waiting
                adminDb
                    .collection('dca_bots')
                    .doc(autotrader.id)
                    .update({
                        tradeAmount: updateTradeAmount
                    }).catch((error) => {
                        console.log(error.message, `error updating autotrader tradeAmount for smart_trade_id ${smart_trade_id}`, JSON.stringify(body));
                    });
            }
            delete responseCloseMarket.pair;
            adminDb.collection('3commas_logs').add(sendDataTo3CommasLogs);

            return { ...responseCloseMarket, smart_trade_id, updateTradeAmount: !isNaN(updateTradeAmount) ? updateTradeAmount : null };
        }
        // create a timeout for 10 seconds and add console.log to indicate it's waiting
        // console.log('waiting for 10 seconds')
        // await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
        console.log('latest trade for this is not found', arr, JSON.stringify(body));
        return null;
    }
}


async function executeNewTrade({
    bodySend,
    body,
    nonce,
    updateTradeAmount,
    autotrader,
    webhookId,
}) {
    const queryParams = `/public/api/v2/smart_trades`;
    const finalUrl = baseUrl + queryParams;
    const signatureMessage = queryParams + JSON.stringify(bodySend);
    const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
    console.log(`executinggggggggg ${JSON.stringify(bodySend)}`)
    const updatedBodySend = {
        ...bodySend,
        position: {
            ...bodySend.position,
            units: {
                value: updateTradeAmount ? String(updateTradeAmount) : bodySend.position.units.value // check if the previous trade updates the tradeAmount, otherwise use the original tradeAmount
            }
        }
    }
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
        console.log('Failed to execute smart trade', responseExecute);
        if (nonce <= MAX_EXECUTION_RETRIES) {
            console.log('retrying execute smart trade', nonce);
            return await executeNewTrade({
                bodySend,
                body,
                nonce: nonce + 1,
                updateTradeAmount,
                webhookId
            }); // retry MAX_EXECUTION_RETRIES times
        }
        return {
            error: responseExecute.error + ', ' + responseExecute.error_description,
            error_attributes: responseExecute.error_attributes
        }
    }
    const smart_trade_id = String(responseExecute.id || '');
    delete responseExecute.id;
    delete responseExecute.pair;

    // save to 3commas_logs without waiting for it to finish
    adminDb
        .collection('3commas_logs')
        .add({
            ...responseExecute,
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
            pair: body.pair,
            smart_trade: true,
            requestId: bodySend,
        })
    return { ...responseExecute, smart_trade_id };
}


// const mockResult = [
//     {
//         "trading_plan_pair": [
//             "XMA_USDT_ADA"
//         ],
//         "tradeAmount": "10",
//         "smart_trade": true,
//         "status": "ACTIVE",
//         "exchange_external_id": "33100833",
//         "id": "TESTING_SMART_TRADE",
//         "responseExecute": {
//             "id": 33556053,
//             "version": 2,
//             "account": {
//                 "id": 33100833,
//                 "type": "binance_futures",
//                 "name": "TWGwDjYIPgMRp2UhFH4U",
//                 "market": "Binance Futures USDT-M",
//                 "link": "/accounts/33100833"
//             },
//             "instant": false,
//             "status": {
//                 "type": "created",
//                 "basic_type": "created",
//                 "title": "Pending"
//             },
//             "leverage": {
//                 "enabled": true,
//                 "type": "isolated",
//                 "value": "1.0",
//                 "type_editable": true
//             },
//             "position": {
//                 "type": "sell",
//                 "editable": false,
//                 "units": {
//                     "value": "10.0",
//                     "editable": false
//                 },
//                 "price": {
//                     "value": "0.7275",
//                     "value_without_commission": "0.7275",
//                     "editable": true
//                 },
//                 "total": {
//                     "value": "7.275"
//                 },
//                 "order_type": "market",
//                 "status": {
//                     "type": "idle",
//                     "basic_type": "idle",
//                     "title": "Pending"
//                 }
//             },
//             "take_profit": {
//                 "enabled": false,
//                 "price_type": "value",
//                 "steps": []
//             },
//             "stop_loss": {
//                 "enabled": false
//             },
//             "reduce_funds": {
//                 "steps": []
//             },
//             "market_close": {},
//             "note": "",
//             "note_raw": null,
//             "skip_enter_step": false,
//             "data": {
//                 "editable": false,
//                 "current_price": {
//                     "bid": "0.7275",
//                     "ask": "0.7276",
//                     "last": "0.7273",
//                     "quote_volume": "653693115.2859",
//                     "day_change_percent": "0.386"
//                 },
//                 "target_price_type": "price",
//                 "orderbook_price_currency": "USDT",
//                 "base_order_finished": true,
//                 "missing_funds_to_close": "0.0",
//                 "liquidation_price": null,
//                 "average_enter_price": null,
//                 "average_close_price": null,
//                 "average_enter_price_without_commission": null,
//                 "average_close_price_without_commission": null,
//                 "panic_sell_available": false,
//                 "add_funds_available": false,
//                 "reduce_funds_available": false,
//                 "force_start_available": false,
//                 "force_process_available": true,
//                 "cancel_available": false,
//                 "finished": false,
//                 "base_position_step_finished": false,
//                 "entered_amount": "0.0",
//                 "entered_total": "0.0",
//                 "closed_amount": "0.0",
//                 "closed_total": "0.0",
//                 "commission": "0.00045",
//                 "created_at": "2025-03-20T11:35:27.460Z",
//                 "updated_at": "2025-03-20T11:35:27.460Z",
//                 "type": "smart_cover"
//             },
//             "profit": {
//                 "volume": null,
//                 "usd": null,
//                 "percent": "0.0",
//                 "roe": "0.0"
//             },
//             "margin": {
//                 "amount": null,
//                 "total": null
//             },
//             "is_position_not_filled": true
//         },
//         "responseCloseMarket": {
//             "id": 33556041,
//             "version": 2,
//             "account": {
//                 "id": 33100833,
//                 "type": "binance_futures",
//                 "name": "TWGwDjYIPgMRp2UhFH4U",
//                 "market": "Binance Futures USDT-M",
//                 "link": "/accounts/33100833"
//             },
//             "instant": false,
//             "status": {
//                 "type": "panic_sell_pending",
//                 "basic_type": "panic_sell_pending",
//                 "title": "Closing at Market Price"
//             },
//             "leverage": {
//                 "enabled": true,
//                 "type": "isolated",
//                 "value": "1.0",
//                 "type_editable": true
//             },
//             "position": {
//                 "type": "buy",
//                 "editable": false,
//                 "units": {
//                     "value": "10.0",
//                     "editable": false
//                 },
//                 "price": {
//                     "value": "0.7278",
//                     "value_without_commission": "0.7275",
//                     "editable": false
//                 },
//                 "total": {
//                     "value": "7.2786375"
//                 },
//                 "order_type": "market",
//                 "status": {
//                     "type": "finished",
//                     "basic_type": "finished",
//                     "title": "Finished"
//                 }
//             },
//             "take_profit": {
//                 "enabled": false,
//                 "price_type": "value",
//                 "steps": []
//             },
//             "stop_loss": {
//                 "enabled": false
//             },
//             "reduce_funds": {
//                 "steps": []
//             },
//             "market_close": {},
//             "note": "",
//             "note_raw": null,
//             "skip_enter_step": false,
//             "data": {
//                 "editable": false,
//                 "current_price": {
//                     "bid": "0.7275",
//                     "ask": "0.7276",
//                     "last": "0.7272",
//                     "quote_volume": "653688540.6814",
//                     "day_change_percent": "0.373"
//                 },
//                 "target_price_type": "price",
//                 "orderbook_price_currency": "USDT",
//                 "base_order_finished": true,
//                 "missing_funds_to_close": "0.0",
//                 "liquidation_price": null,
//                 "average_enter_price": "0.7278",
//                 "average_close_price": null,
//                 "average_enter_price_without_commission": "0.7275",
//                 "average_close_price_without_commission": null,
//                 "panic_sell_available": false,
//                 "add_funds_available": false,
//                 "reduce_funds_available": false,
//                 "force_start_available": false,
//                 "force_process_available": true,
//                 "cancel_available": false,
//                 "finished": false,
//                 "base_position_step_finished": true,
//                 "entered_amount": "10.0",
//                 "entered_total": "7.2786375",
//                 "closed_amount": "0.0",
//                 "closed_total": "0.0",
//                 "commission": "0.00045",
//                 "created_at": "2025-03-20T11:34:09.449Z",
//                 "updated_at": "2025-03-20T11:35:25.583Z",
//                 "type": "smart_trade"
//             },
//             "profit": {
//                 "volume": "-0.00691125",
//                 "usd": "-0.00691125",
//                 "percent": "-0.09",
//                 "roe": "-0.09"
//             },
//             "margin": {
//                 "amount": "10.0",
//                 "total": "7.278"
//             },
//             "is_position_not_filled": false
//         }
//     }
// ]