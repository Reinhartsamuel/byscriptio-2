const { adminDb } = require("@/lib/firebase-admin-config");
const { default: generateSignatureRsa } = require("../generateSignatureRsa");
const { NextResponse } = require("next/server");

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;

const baseUrl = 'https://api.3commas.io';

export async function closeAtMarketPrice({
    body,
    webhookId
}) {
    try {
        let tradesHistory = [];
        // build query
        let query = adminDb
            .collection('3commas_logs')
            .where('trading_plan_id', '==', body.trading_plan_id)
            .where('pair', '==', body.pair)
            .where('status_type', '==', 'waiting_targets')


        if (body.account_id !== 'all') {
            query = query.where('exchange_external_id', '==', Number(body.account_id));
        }
        if (body.position.type !== 'all') {
            query = query.where('action', '==', (body.position.type || '').toUpperCase());
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
                method: body.method, // body supposed to be POST
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
