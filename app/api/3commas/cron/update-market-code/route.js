import generateSignatureRsa from "@/app/utils/generateSignatureRsa";
import { adminDb } from "@/lib/firebase-admin-config";
const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';
export async function GET() {

    try {
        // 1. get all exchange_accounts where market_code is nullish
        const arr = [];
        const querySnapshot = await adminDb
            .collection('exchange_accounts')
            .where('market_code', '==', null)
            .limit(10)
            .get();
        querySnapshot.forEach((doc) => {
            arr.push({
                ...doc.data(),
                id: doc.id
            });
        });

        console.log(arr.map((x) => x.id), 'id docs to update')
        await Promise.all(arr.map(async (exchangeAccount) => {
            const totalParams = '/public/api' + `/ver1/accounts/${exchangeAccount.external_id}`;
            const finalUrl = baseUrl + totalParams;
            const signature = generateSignatureRsa(PRIVATE_KEY, totalParams);
            const response = await fetch(finalUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    APIKEY: API_KEY,
                    Signature: signature,
                }
            });
            const data = await response.json();
            // "exchange_name": "Binance Futures COIN-M",
            // "market_code": "binance_futures_coin",
            if (data.exchange_name) {
                console.log(`updating doc id ${exchangeAccount.id}, market_code ${data.market_code}`)
                await adminDb
                    .collection('exchange_accounts')
                    .doc(exchangeAccount.id)
                    .update({
                        exchange_external_name: data.exchange_name,
                        market_code: data.market_code,
                    });


                // const arr2 = [];
                // const querySnapshot2 = await adminDb
                //     .collection('3commas_logs')
                //     .where('exchange_external_id', '==', Number(exchangeAccount.external_id))
                //     .get()
                // querySnapshot2.forEach((doc) => {
                //     arr2.push({
                //         ...doc.data(),
                //         id: doc.id
                //     });
                // });

                // await Promise.all(arr2.map(async (log) => {
                //     await adminDb
                //         .collection('3commas_logs')
                //         .doc(log.id)
                //         .update({
                //             exchange_external_name: data.exchange_name,
                //             market_code: data.market_code,
                //         })
                // }))
            }
        }))

        return Response.json({
            status: 'okelah',
            lengthUpdated: 0,
            arr
        })
    } catch (error) {
        return new Response(JSON.stringify({
            status: false,
            message: error.message,
            errorCode: error.code
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
} 