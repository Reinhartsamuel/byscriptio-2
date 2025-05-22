import { cancelSmartTrade } from '@/app/utils/smart-trades/cancelSmartTrade';
import { closeAtMarketPrice } from '@/app/utils/smart-trades/closeAtMarketPrice';
import { createSmartTrade } from '@/app/utils/smart-trades/createSmartTrade';
import { adminDb } from '@/lib/firebase-admin-config';
import { NextResponse } from 'next/server';

// const MAX_EXECUTION_RETRIES = 3;
export const maxDuration = 300; // This function can run for a maximum of 300 seconds

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
        const _pair = body?.pair || '';
        console.log(`_pair_pair_pair_pair_pair_pair_pair_pair`, _pair)
        // console.log(body, 'testing smarttrade body');
        const addWebhookResult = await adminDb.collection('webhooks').add({
            ...body,
            action: body?.method === 'CANCEL' ? 'CANCEL' : body?.position?.type ? body?.position?.type?.toUpperCase() : 'unknown',
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
                pairFromBody: _pair
            });
            // console.log("resultCreateSmartTrade:::", resultCreateSmartTrade, JSON.stringify(body));
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