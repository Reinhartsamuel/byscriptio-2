import { coins } from "@/app/dummy";
import { cancelSmartTrade } from "@/app/utils/smart-trades/cancelSmartTrade";
import { closeAtMarketPrice } from "@/app/utils/smart-trades/closeAtMarketPrice";
import { createSmartTrade } from "@/app/utils/smart-trades/createSmartTrade";
import { editSmartTrade } from "@/app/utils/smart-trades/editSmartTrade";
import trackIp from "@/app/utils/trackIp";
// import tradeExecutedTemplate from "@/app/utils/emailHtmlTemplates/tradeExecutedTemplate";
import { adminDb } from "@/lib/firebase-admin-config";
import moment from "moment";
import { NextResponse } from "next/server";

// const example = {
//     pair: 'USDT_BTC',
//     type: 'buy',
//     price: 80000,
//     trading_plan_id: 'XMA',
//     timeframe : '4h',
//     timestamp: 1700000000
// };

const telegram_bot_token = process.env.TELEGRAM_BOT_TOKEN;


export const maxDuration = 300; // This function can run for a maximum of 300 seconds

function determineAction(body) {
  if (!body) return 'unknown';

  // Check for CANCEL and CLOSE methods first
  if (body.method === 'CANCEL') return 'CANCEL';
  if (body.method === 'CLOSE') return 'CLOSE';

  // Check position type
  if (body?.position && typeof body?.position?.type === 'string') {
    return body.position.type.toUpperCase();
  }

  return 'unknown';
}

export async function POST(request) {
  try {
    const body = await request.json();
    trackIp(request);
    console.log(JSON.stringify(body), 'bodyyyyyy');
    const _pair = body.pair;
    const messageTelegram = `pair: ${body?.pair} SMART TRADE SIGNAL \n price: ${body?.price} \n timeframe: ${body?.time_frame} \n timestamp: ${body?.timestamp} \n date: ${moment.unix(body?.timestamp).format('DD-MM-YYYY HH:mm')} \n action: ${body?.type?.toUpperCase()} \n trading_plan_id: ${body?.trading_plan_id}`
    fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: "-1002265379113",
        text: messageTelegram
      })
    }).then((res) => {
      res.json()
        .then((result) => console.log(result, 'result telegram send'))
    }).catch((e) => {
      console.log(e.message + ' :::error sending to telegram' + JSON.stringify(body))
    })


    // saving image to firestore
    try {
      const ticker = body?.pair?.split('_')[1];
      // find in dummy data
      const foundInDummy = coins.filter((x) => x?.symbol === ticker);
      if (
        Array.isArray(foundInDummy) && foundInDummy?.length === 0
      ) {
        //get logo from coingecko
        const fetchList = await fetch('https://api.coingecko.com/api/v3/coins/list', {
          headers: {
            accept: 'application/json',
            'x-cg-api-key': process.env.COINGECKO_API_KEY
          }
        });
        const fetchListResult = await fetchList.json();

        const obj = fetchListResult?.find((coin) => coin.symbol === ticker.toLowerCase());
        const id = obj.id;
        const fetchCoin = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`, {
          headers: {
            accept: 'application/json',
            'x-cg-api-key': process.env.COINGECKO_API_KEY
          }
        });
        const result = await fetchCoin.json();

        //save to firestore without waiting
        adminDb
          .collection('logos')
          .doc(ticker)
          .set({
            image: result?.image?.small
          })
      } else {
        // console.log({
        //     message: `crypto logo already exist in dummy, ticker : ${ticker}`,
        // })
      }
    } catch (error) {
      console.log(error.message, 'error saving crypto logos to firestore', JSON.stringify(body))
    }
    const addWebhookResult = await adminDb.collection('webhooks').add({
      ...body,
      action: determineAction(body),
      smart_trade: true,
      type: 'autotrade',
      createdAt: new Date(),
      rawSignal: JSON.stringify(body),
      flag: body?.flag || '',
      // result: result.map((x) => x?.status),
    });
    if (body?.flag !== 'testing' && body?.trading_plan_id !== 'GRID CUANTERUS' && body?.method === 'CREATE') {
      adminDb.collection('webhooks_safe_preview').add({
        ...body,
        action: determineAction(body),
        smart_trade: true,
        type: 'autotrade',
        createdAt: new Date(),
        rawSignal: JSON.stringify(body),
        flag: body?.flag || '',
        // result: result.map((x) => x?.status),
      });
    }
    console.log(`added webhook with id ${addWebhookResult.id}`)

    // trading_plan_id is constructed of trading plan name and pair
    const tp_unique_id = body?.trading_plan_id + '_' + body?.pair;


    // initiate
    let autotraders = [];
    let result = null;


    if (body.action === 'CANCEL') { // change to body.action === 'CANCEL'
        return await cancelSmartTrade({
            body,
            webhookId: addWebhookResult.id,
        });
    } else if (body.action === 'CLOSE') { // change to body.action === 'CLOSE'
        return await closeAtMarketPrice({
            body,
            webhookId: addWebhookResult.id,
        });
    } else if (body.action === 'EDIT') {
        return await editSmartTrade({
            body,
            webhookId: addWebhookResult.id,
        })
    }

    if (body.action !== 'CREATE') {
        console.log(`RETURNING ERROR:::: Method is not supported! You sent method : ${body.method}`);
        return new NextResponse(JSON.stringify({
            status: false,
            errorCode: 400,
            error : `Action is not supported! You sent action : ${body.action}`,
            message: `Action is not supported! You sent action : ${body.action}. Only allowed action is 'CREATE', 'CLOSE', 'CANCEL', 'EDIT'`
        }), {
            status: 400
        })
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
        return NextResponse.json({ status: false, message: 'No bots foundd' });
    }
    querySnapshot.forEach((doc) => {
        autotraders.push({ ...doc.data(), id: doc.id });
    });
    console.log(autotraders.length, 'autotraders.length');

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
    const body = await request.json();
    console.log(error.message, 'error smart trade', JSON.stringify(body))
    return new Response(JSON.stringify({
      status: false,
      message: error.message,
      error
    }), {
      status: 500
    })
  }
}
