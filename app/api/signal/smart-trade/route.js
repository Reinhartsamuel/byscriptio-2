import { adminDb } from "@/lib/firebase-admin-config";
import { doc } from "firebase/firestore";

const example = {
    pair: 'USDT_BTC',
    type: 'buy',
    price: 80000,
    trading_plan_id: 'XMA'
};


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

        console.log(autotraders, 'autotraders');


        const resultPromise = await Promise.all(autotraders.map(async (autotrader) => {
            // 2. find latest trade history on 3commas_logs where same trading_plan_id and pair
            const latestTradeHistory = await adminDb
            .collection('3commas_logs')
            .where('trading_plan_id', '==', body.trading_plan_id)
            .where('pair', '==', body.pair)
            .where('autotrader_id', '==', autotrader.id)
            .orderBy('created_at', 'desc')
            .limit(1)
            .get();

            return {
                ...autotrader,
                latestTradeHistory
            }
        }));











        return Response.json({
            status: true,
            message: 'Signal received',
            body
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