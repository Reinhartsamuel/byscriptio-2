/* eslint-disable no-unsafe-optional-chaining */
import { getMultiplier } from "@/app/utils/getMultiplier";
import { createSmartTrade } from "@/app/utils/smart-trades/createSmartTrade";
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
        const _tradingPlanId = bot.trading_plan_pair[0]?.split('_')[0];
        const _pair = bot.trading_plan_pair[0]?.split('_').slice(1).join('_');
        const multiplier = await getMultiplier(_pair?.split('_')[1], bot);

        const asset_symbol = _pair.split('_')[1];
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


        const payload = {
            "account_id": bot.exchange_external_id,
            "pair": _pair,
            "position": {
                "type": body.action,
                "order_type": "market",
                "units": {
                    "value": String(
                        parseFloat(bot.tradeAmount) /
                        (parseFloat(PRICE_USD) * multiplier)
                    )
                },
                "price": {
                    "value": PRICE_USD
                }
            },
            "leverage": {
                "enabled": true,
                "type": "custom",
                "value": "1"
            },
            "take_profit": {
                "enabled": false,
                // "steps": [
                //     {
                //         "order_type": "limit",
                //         "volume": "100",
                //         "price": {
                //             "value": "' + str.tostring(limit_entry_price) + '",
                //             "type": "last"
                //         }
                //     }
                // ]
            },
            "stop_loss": {
                "enabled": false
            },
            "method": "CREATE",
            "trading_plan_id": _tradingPlanId,
            "market_type": bot?.marketType || '',
            "timestamp": new Date()
        };

        const resultCreateSmartTrade = await createSmartTrade({
            autotrader: bot,
            body: payload,
            webhookId: '',
            pairFromBody: _pair
        });
        console.log('\n====resultCreateSmartTrade====', resultCreateSmartTrade, '\n')
        if(resultCreateSmartTrade.error){
            return new Response(JSON.stringify(resultCreateSmartTrade), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        return Response.json({
            coindeskData,
            data:resultCreateSmartTrade
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