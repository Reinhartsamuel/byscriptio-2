import { adminDb } from "@/lib/firebase-admin-config";
import generateSignatureRsa from "../generateSignatureRsa";
import { NextResponse } from "next/server";
const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;

const baseUrl = 'https://api.3commas.io';

export async function cancelSmartTrade({
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
            if (body?.for_type !== 'all' && body?.type !== undefined) query = query.where('action', '==', body.for_type.toUpperCase());


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
                webhookId,
                requestBody : null
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