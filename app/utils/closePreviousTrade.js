
import generateSignatureRsa from "./generateSignatureRsa";
import { getSmartTradeStatus } from "./getSmartTradeStatus";
const { adminDb } = require("@/lib/firebase-admin-config");

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;

const baseUrl = 'https://api.3commas.io';
export async function closePreviousTrade({
    body,
    bodySend,
    autotrader,
    webhookId,
    pairFromBody
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
        arr[0].status?.type !== 'panic_sell_pending' &&
        arr[0].status?.type &&
        arr[0].status?.type !== 'panic_sold'
    ) {
        console.log(`found ${arr[0].smart_trade_id} trade and it's not closed, so trying to close first`);
        // check status of the latest trade history
        const { status } = await getSmartTradeStatus(arr[0].smart_trade_id);
        console.log(status, arr[0].smart_trade_id, 'this is status weve longing for');


        if (status?.type !== 'panic_sold' && status?.type !== 'failed') {
            console.log(`found ${arr[0].smart_trade_id} trade and it's not panic_sold nor failed, so trying to close first`);
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
                // throw new Error('Failed to close trade' + '  ' +  JSON.stringify(responseCloseMarket.error) + '  ' + JSON.stringify(responseCloseMarket.error_description));
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
                pair: pairFromBody,
                previousBuyId: arr[0]?.id || '',
                smart_trade: true,
                requestBody: JSON.stringify(bodySend),
                webhookId
            }
            const updateTradeAmount = parseFloat(responseCloseMarket?.margin?.amount) + parseFloat(responseCloseMarket?.profit?.usd);
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