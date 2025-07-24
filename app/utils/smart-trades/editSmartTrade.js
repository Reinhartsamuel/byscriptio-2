import { adminDb } from "@/lib/firebase-admin-config";
import { NextResponse } from "next/server";
import generateSignatureRsa from "../generateSignatureRsa";

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;

const baseUrl = 'https://api.3commas.io';

export async function editSmartTrade({
    body,
    webhookId
}) {
    if (!body.position.type) {
        console.log('position.type is required');
        return NextResponse.json(
            { error: 'position.type is required', message: 'position.type is required', },
            { status: 400 }
        );
    }
    if (!body.status) {
        console.log('status is required');
        return NextResponse.json(
            { error: 'status is required', message: 'status is required', },
            { status: 400 }
        );
    }
    try {
        let tradesHistory = [];
        // build query
        let query = adminDb
            .collection('3commas_logs')
            .where('trading_plan_id', '==', body.trading_plan_id)
            .where('pair', '==', body.pair)
            .where('status_type', '==', body.status)

        console.log('============================================ QUERY START ============================================')
        console.log(body.trading_plan_id, 'trading_plan_id');
        console.log(body.pair, 'pair');
        console.log(body.status, 'status_type');

        if (body.position.type !== 'all') {
            query = query.where('action', '==', body.position.type.toUpperCase())
            console.log(body.position.type.toUpperCase(), 'action');
        }

        if (body.account_id !== 'all') {
            query = query.where('exchange_external_id', '==', Number(body.account_id));
            console.log(body.account_id, 'exchange_external_id');
        }

        const querySnapshot = await query.get();
        console.log('============================================ QUERY END ============================================')
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
        });

        const resPromise = await Promise.allSettled(tradesHistory.map(async (item) => {
            const totalParams = '/public/api' + `/v2/smart_trades/${item.smart_trade_id}`;
            const finalUrl = baseUrl + totalParams;
            // const signature = generateSignatureRsa(PRIVATE_KEY, totalParams);


            let constructedBody = {
                position: {
                    type: body.position.type,
                    units: {
                        value : item.position.units.value,
                    },
                    price : {
                        value: item.position.price.value
                    }
                },
            };
            if (body.leverage) constructedBody.leverage = body.leverage;
            if (body.take_profit) constructedBody.take_profit = body.take_profit;
            if (body.stop_loss) constructedBody.stop_loss = body.stop_loss;


            const signatureMessage = totalParams + JSON.stringify(constructedBody);
            console.log(signatureMessage, 'signatureMessageddddd');
            const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);

            const response = await fetch(finalUrl, {
                method: body.method, // body is supposed to be PATCH
                headers: {
                    'Content-Type': 'application/json',
                    APIKEY: API_KEY,
                    Signature: signature,
                },
                body: JSON.stringify(constructedBody)
            });
            console.log('constructedBody::::',constructedBody);
            const responseEdit = await response.json();
            delete responseEdit.id;
            delete responseEdit.pair;
            delete responseEdit.action;
            const safeCopy = JSON.parse(JSON.stringify(responseEdit));
            const dataToUpdate = {
                ...safeCopy,
                updateRequest: body,
                updateResponse: responseEdit,
                updateWebhook: webhookId,
            };
            console.log(`updating dataToUpdate for trade ${dataToUpdate.smart_trade_id}, aurotrader ${dataToUpdate.autotrader_id}, user ${dataToUpdate.name}:::`, dataToUpdate);
            if (responseEdit.error) {
                console.log('RETURNING ERRORRRRR ', {
                error: responseEdit.error,
                message: responseEdit.error,
                dataToUpdate,
            });
                return NextResponse(JSON.stringify({
                error: responseEdit.error,
                message: responseEdit.error,
                dataToUpdate,
            }), {status : 500});}
            adminDb.collection('3commas_logs').doc(item.id).update(dataToUpdate);
        }))
        console.log('returning', {
            resPromise,
            status: true
        })
        return NextResponse.json({
            resPromise,
            status: true
        })
    } catch (error) {
        console.log(error.message, ' error 500internal')
        return NextResponse.json(
            { error: 'Internal Server Error', errorMessage: error.message, message: error.message, },
            { status: 500 }
        );
    }
}
