import { adminDb } from '@/lib/firebase-admin-config';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Get authorization header
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
        console.log(body, 'testing smarttrade body');
        const addWebhookResult = await adminDb.collection('webhooks').add({
            ...body,
            action: body?.type?.toUpperCase(),
            smart_trade: true,
            type: 'autotrade',
            createdAt: new Date(),
            flag: 'testing',
            // result: result.map((x) => x?.status),
        });
        // Process the request
        // TODO: Add your business logic here

        // trading_plan_id is constructed of trading plan name and pair
        const tp_unique_id = body?.trading_plan_id + '_' + body?.pair;


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
        });





        return NextResponse.json(
            {
                message: 'Success',
                autotraders,
                webhookId : addWebhookResult.id
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



// async function createSmartTrade({
//     autotrader,
//     positionCalculation = "compound",

// }) {
//     // const payloadExample = {
//     //     "account_id": 32455218,
//     //     "pair": "USDT_BTC",
//     //     "instant": "true",
//     //     "position": {
//     //         "type": "buy",
//     //         "units": {
//     //             "value": "0.01"
//     //         },
//     //         "order_type": "market"
//     //     },
//     //     "leverage": {
//     //         "enabled": true,
//     //         "type": "custom",
//     //         "value": "12"
//     //     }
//     // };

//     const payload = {
//         "account_id": Number(autotrader.exchange_external_id),
//         "pair": "USDT_BTC",
//         "instant": "true",
//         "position": {
//             "type": "buy",
//             "units": {
//                 "value": "0.01"
//             },
//             "order_type": "market"
//         },
//         "leverage": {
//             "enabled": true,
//             "type": "custom",
//             "value": "12"
//         }
//     };


// }
