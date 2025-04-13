import { coins } from "@/app/dummy";
import { closePreviousTrade } from "@/app/utils/closePreviousTrade";
import { executeNewTrade } from "@/app/utils/executeNewTrade";
// import tradeExecutedTemplate from "@/app/utils/emailHtmlTemplates/tradeExecutedTemplate";
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

const telegram_bot_token = process.env.TELEGRAM_BOT_TOKEN;

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