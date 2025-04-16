/* eslint-disable no-unsafe-optional-chaining */
import { getSmartTradeStatus } from "@/app/utils/getSmartTradeStatus";
import { adminDb } from "@/lib/firebase-admin-config";

export async function POST(request) {
    try {
        const body = await request.json();
        const doc = await adminDb
            .collection('dca_bots')
            .doc(body.autotrader_id)
            .get();
        if (!doc.exists) {
            return new Response(JSON.stringify({ error: 'Bot not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        const bot = { ...doc.data(), id: doc.id };


        // 1. check latest trades from 3commas_logs based on pair and autotrader_id
        let historyTradesFromDb = [];
        const _tradingPlanId = bot.trading_plan_pair[0]?.split('_')[0];
        const _pair = bot.trading_plan_pair[0]?.split('_').slice(1).join('_')
        const latestTradeHistory = await adminDb
            .collection('3commas_logs')
            .where('autotrader_id', '==', bot.id)
            .where('pair', '==', _pair)
            .where('trading_plan_id', '==', _tradingPlanId)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();
        latestTradeHistory.forEach((doc) => {
            historyTradesFromDb.push({ ...doc.data(), id: doc.id });
        })
        console.log(historyTradesFromDb.map((x) => x.id), 'historyTradesFromDb');
        // return Response.json({ bot, historyTradesFromDb });


        // 2. if latest trade is present, check the status from it's smart_trade_id
        if (historyTradesFromDb.length > 0) {
            console.log('found an active trade!! closing it....', historyTradesFromDb[0]?.smart_trade_id)
            const {status} = await getSmartTradeStatus(historyTradesFromDb[0]?.smart_trade_id);
            console.log(status,'ANAK NGENTOT');
            if (status.type === 'waiting_targets' || status.type === 'created') {
                const res = await fetch('http://localhost:3000/api/3commas/smart-trade/execute/close-at-market-price-test', {
                    method: 'POST',
                    body: JSON.stringify({
                        id: historyTradesFromDb[0]?.smart_trade_id
                    })
                });
                const responseCloseMarket = await res.json();
                console.log(responseCloseMarket, 'responseCloseMarket');
                const {data, error, message} = responseCloseMarket;
                if (error) {
                    console.log(error, 'error closing previous trade!', message);
                    return new Response(JSON.stringify({ message: 'Cannot close previous trade!',error: responseCloseMarket?.error_description }), {
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }
                if (data) {
                    const checkStatus = await getSmartTradeStatus(historyTradesFromDb[0]?.smart_trade_id);
                    // 3. if status is not closed, close it
                    await adminDb
                        .collection('3commas_logs')
                        .add({
                            ...checkStatus,
                            action: `CLOSE_${historyTradesFromDb[0]?.action}`, // add the action from previous trade, not the action from the request, so we can track the action from the previous trade, not the action from the request, s,
                            smart_trade_id: historyTradesFromDb[0]?.smart_trade_id,
                            createdAt: new Date(),
                            type: `CLOSE_${historyTradesFromDb[0]?.action}`,
                            autotrader_id: body.autotrader_id,
                            exchange_external_id : bot.exchange_external_id,
                            pair: _pair,
                            trading_plan_id: _tradingPlanId,
                            exchange_name : bot.exchange_name,
                            exchange_thumbnail : bot.exchange_thumbnail,
                        });
                }
            } else {
                console.log('trade is not waiting_targets nor created, cannot close it!');
            }
        }

        //4. get crypto price from coindesk
        const asset_symbol = _pair.split('_')[`1`];
        const coindeskDataPromise = await fetch(`
            https://data-api.coindesk.com/asset/v2/metadata?assets=${asset_symbol}&asset_lookup_priority=SYMBOL&quote_asset=USD`);
        const coindeskData = await coindeskDataPromise.json();
        // console.log(coindeskData,'coindeskData');
        const { PRICE_USD } = coindeskData?.Data?.[asset_symbol];
        console.log(PRICE_USD, 'PRICE_USD');
        if (!PRICE_USD) {
            return new Response(JSON.stringify({ error: 'Price not found' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }


        // 5. execute force action
        const payload = {
            accountId: bot.exchange_external_id,
            pair: _pair,
            value: String(parseFloat(bot.tradeAmount) / parseFloat(PRICE_USD)), // amount in token, not in usd, so (amountUsd/price),
            type: body.action,
        }
        console.log(payload, 'payload');


        const resxx = await fetch(
            `http://localhost:3000/api/3commas/smart-trade/execute`,
            {
                method: 'POST',
                body: JSON.stringify(payload)
            }
        );
        const resultxx = await resxx.json();
        console.log(resultxx, 'resultxx');
        if (resultxx?.error) {
            return new Response(JSON.stringify({
                error: resultxx?.error + ' ' + JSON.stringify(resultxx?.error_attributes)
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }


        // 6. add to 3commas_logs
        const checkStatus2 = await getSmartTradeStatus(resultxx.data.id);
        await adminDb
            .collection('3commas_logs')
            .add({
                ...resultxx?.data, // add all the data from resultxx.data, then add the othe
                ...checkStatus2,
                smart_trade_id: resultxx?.data?.id,
                createdAt: new Date(),
                action: `FORCE_${body.action === 'buy' ? 'BUY' : 'SELL'}`,
                autotrader_id: body.autotrader_id,
                exchange_external_id : bot.exchange_external_id,
                exchange_thumbnail : bot.exchange_thumbnail,
                exchange_name : bot.exchange_name,
                pair: _pair,
                trading_plan_id: _tradingPlanId,
            });

        return Response.json({
            coindeskData,
            data: checkStatus2,
        })
    } catch (error) {
        console.error('Error fetching data:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error', message: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}