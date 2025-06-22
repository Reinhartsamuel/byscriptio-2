import generateSignatureRsa from "@/app/utils/generateSignatureRsa";
import trackIp from "@/app/utils/trackIp";
import { adminDb } from "@/lib/firebase-admin-config";
export const maxDuration = 300; // This function can run for a maximum of 300 seconds
const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';



export async function POST(request) {
    try {
        const queryParams = '/public/api' + '/v2/smart_trades?per_page=100&page=1&status=all&order_by=updated_at';
        const finalUrl = baseUrl + queryParams;
        trackIp(request);


        let signatureMessage = queryParams;
        const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                APIKEY: API_KEY,
                Signature: signature,
            }
        }
        const response = await fetch(finalUrl, config);
        const data = await response.json();
        const error = data?.error;
        const error_attributes = data?.error_attributes;
        const error_description = data?.error_description;
        console.log(data?.map((x) => x.id), 'data.map((x) => x.id), these are smart trade ids to be upadated')
        console.log(error, 'error')
        console.log(error_attributes, 'error_attributes')
        console.log(error_description, 'error_description')
        // return new Response('ok')
        if (error) {
            console.log(error, error_attributes, error_description)
            return Response.json({
                error,
                error_attributes
            })
        }

        const result = await Promise.allSettled(data?.map(async (smartTrade) => {
            console.log('processing smart trade with id :', smartTrade.id, smartTrade);
            let searchCorrespondingTrade = [];
            const querySnapshot = await adminDb
                .collection('3commas_logs')
                .where('smart_trade_id', '==', String(smartTrade.id))
                .get();
            querySnapshot.forEach((doc) => {
                searchCorrespondingTrade.push({ ...doc.data(), id: doc.id, })
            });
            console.log(`read searchCorrespondingTrade : ${searchCorrespondingTrade?.length}`)
            searchCorrespondingTrade = searchCorrespondingTrade.filter((x) => !x.already_updated);

            await Promise.all(searchCorrespondingTrade?.map(async (x) => {
                console.log(`updating smart trade id ${smartTrade.id} to 3commas_logs doc id ${x.id}`)
                const withoutId = JSON.parse(JSON.stringify(smartTrade));
                delete withoutId.id;
                delete withoutId.pair;

                const dataToUpdate = {
                    ...withoutId,
                    status_type : withoutId?.status?.type || ''
                };
                if (smartTrade?.status?.type === 'panic_sold' || smartTrade?.status?.type === 'failed') {
                    dataToUpdate.already_updated = true;

                    if (smartTrade?.profit?.usd && smartTrade?.autocompound) {
                        // update initialBalance 
                        const docc = await adminDb.collection('dca_bots').doc(x.autotrader_id).get();
                        const bot = { ...docc.data(), id: docc.id };
                        await adminDb
                            .collection('dca_bots')
                            .doc(x.autotrader_id)
                            .update({
                                tradeAmount:
                                    parseFloat(bot?.tradeAmount) + parseFloat(smartTrade?.profit?.usd),
                                updatedAt: new Date()
                            })
                    }
                }
                if (x.id) {
                    const update = await adminDb
                        .collection('3commas_logs')
                        .doc(x.id)
                        .update(dataToUpdate)
                    console.log(`update: ${update}, smart trade id ${smartTrade.id} to 3commas_logs doc id ${x.id} is updated`)
                } else {
                    console.log(`NOOOOO smart trade id ${smartTrade.id} to 3commas_logs doc id ${x.id} is not updated`)
                }

            }))
        }))
        return Response.json({
            status: true,
            data,
            result
        })
    } catch (error) {
        console.log(error, 'error cron')
        return new Response(JSON.stringify({
            status: false,
            error: error.message,

        }), { status: 500 })
    }
} 