import generateSignatureRsa from "@/app/utils/generateSignatureRsa";
import { adminDb } from "@/lib/firebase-admin-config";

const example = {
    pair: 'USDT_BTC',
    type: 'buy',
    price: 80000,
    trading_plan_id: 'XMA'
};
const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';

export async function POST(request) {
    try {
        const body = await request.json();
        let autotraders = [];

        // 1. find active autotraders
        const querySnapshot = await adminDb
            .collection('dca_bots')
            .where('trading_plan_pair', 'array-contains', body.trading_plan_id + '_' + body.pair)
            .where('status', '==', 'ACTIVE')
            .where('smart_trade', '==', true)
            .get();

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
            console.log(autotrader, 'autotrader anjing')
            const bodySend = {
                account_id: autotrader.exchange_external_id,
                pair: body.pair,
                instant: false,
                position: {
                    type: body.type,
                    units: {
                        value: String(autotrader.tradeAmount)
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
            console.log('hehe');
            // 2. find latest trade history on 3commas_logs where same trading_plan_id and pair
            let arr = [];
            try {
                const latestTradeHistory = await adminDb
                .collection('3commas_logs')
                .where('autotrader_id', '==', autotrader.id)
                // .where('pair', '==', body.pair)
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get();
                latestTradeHistory.forEach((doc) => {
                    arr.push({ ...doc.data(), id: doc.id });
                })
                console.log(arr, 'arr');
            } catch (error) {
                console.log(error.message, 'error');
            }
           
            // 3. if the latest trade history is not closed, close first
            // by close_at_market_price function
            if (
                arr.length > 0 && 
                arr[0].status.type 
                 !== 'panic_sell_pending') {
                // close at market price function here
                console.log(`trying to close trade ${arr[0].smart_trade_id}`)
                const queryParamsCloseMarket = `/public/api/v2/smart_trades/${arr[0].smart_trade_id}/close_by_market`;
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
                console.log(responseCloseMarket, 'responseCloseMarket');
                // result of close_at_market_price function, update to 3commas_logs
                await adminDb
                .collection('3commas_logs')
                .add({
                    name : autotrader?.name  || '',
                    email : autotrader?.email || '',
                    uid : autotrader.uid || '',
                    smart_trade_id : responseCloseMarket?.id || '',
                    autotrader_id : autotrader.id || '',
                    createdAt: new Date(),
                    ...responseCloseMarket
                })
            }

            // 4. execute smart trade
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
            const responseExecute = await response2.json();
            console.log(responseExecute, 'responseExecute');
            // result of execute smart trade, update to 3commas_logs
            await adminDb
            .collection('3commas_logs')
            .add({
                name : autotrader?.name  || '',
                email : autotrader?.email || '',
                uid : autotrader.uid || '',
                smart_trade_id : responseExecute.id,
                autotrader_id : autotrader.id || '',
                createdAt: new Date(),

                ...responseExecute
            })
            return {
                ...autotrader,
                // latestTradeHistory,
                responseExecute
            }
        }));
        return Response.json({
            status: true,
            message: 'Signal received',
            body,
            result : resultPromise,
            
        })
    } catch (error) {
        return new Response(JSON.stringify({
            status: false,
            message: error.message,
            error
        }), {
            status: 500
        })
    }
}