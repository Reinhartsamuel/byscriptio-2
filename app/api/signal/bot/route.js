/* eslint-disable no-undef */
import { coins } from '@/app/dummy';
import tradeExecutedTemplate from '@/app/utils/emailHtmlTemplates/tradeExecutedTemplate';
import { adminDb } from '@/lib/firebase-admin-config';
import { FieldValue } from 'firebase-admin/firestore';
import moment from 'moment';

const threeCommasUrl = 'https://app.3commas.io/trade_signal/trading_view';
const telegram_bot_token = process.env.TELEGRAM_BOT_TOKEN;

// THIS IS WHAT THE BODY LOOKS LIKE :
// {
//   "action": "close_at_market_price",
//   "message_type": "bot",
//   "bot_id": "bot_ids",
//   "email_token": "52c6860e-5814-47ed-a5ae-663d78446439",
//   "delay_seconds": 0,
//   "pair": "USDT_BNB",
//   "trading_plan_id": "XMA",
//   "time_frame": "240",
//   "timestamp": "1742702400000",
//   "price": "622.88",
//   "marketType": "futures"
// }
// ------ OR -------
// {
//   "message_type": "bot",
//   "bot_id": "bot_ids",
//   "email_token": "52c6860e-5814-47ed-a5ae-663d78446439",
//   "delay_seconds": 0,
//   "pair": "USDT_BNB",
//   "trading_plan_id": "XMA",
//   "time_frame": "240",
//   "timestamp": "1742702400000",
//   "price": "622.88",
//   "marketType": "futures"
// }
// THIS IS WHAT SHOULD BE SENT TO 3COMMAS :
// {
//   message_type: 'bot',
//   bot_id: 14359731,
//   email_token: '',
//   delay_seconds: 0,
//   pair: '',
// };



export async function POST(request) {
  try {
    const body = await request.json();
    if (body?.marketType === 'futures') {
      // Fire and forget - explicitly show we don't need to wait
      Promise.resolve().then(() => {
        fetch('/api/signal/smart-trade', {
          method: 'POST',
          body: JSON.stringify({
            ...body,
            type: body.action ? 'sell' : 'buy'
          }),
        }).catch((err) => {
          console.error('Failed to forward signal to smart-trade:', err);
          // Don't throw - we want to continue with the main flow even if this fails
        });
      });
    }
    try {
      const messageTelegram = `pair: ${body?.pair} \n price: ${body?.price} \n timeframe: ${body?.time_frame} \n timestamp: ${body?.timestamp} \n date: ${moment.unix(body?.timestamp).format('DD-MM-YYYY HH:mm')} \n action: ${body?.action === 'close_at_market_price' ? 'SELL' : 'BUY'} \n trading_plan_id: ${body?.trading_plan_id}`
      const res = await fetch(`https://api.telegram.org/bot${telegram_bot_token}/sendMessage`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: "-1002265379113",
          text: messageTelegram
        })
      })
      const resTelegram = await res.json();
      console.log(resTelegram, 'resTelegram')
    } catch (error) {
      console.log(error.message + ' :::error sending to telegram')
    }

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

        //save to firestore
        await adminDb
          .collection('logos')
          .doc(ticker)
          .set({
            image: result?.image?.small
          })

        console.log({
          message: `coingecko get image : ${result?.image?.small}`,
          image: result?.image?.small
        })
      } else {
        console.log({
          message: `crypto logo already exist in dummy, ticker : ${ticker}`,
        })
      }
    } catch (error) {
      console.log(error.message, 'error saving crypto logos to firestore')
    }
    const addWebhookResult = await adminDb.collection('webhooks').add({
      ...body,
      type: 'autotrade',
      createdAt: new Date(),
      flag: body?.flag || '',
      // result: result.map((x) => x?.status),
    });
    // console.log(body);

    // trading_plan_id is constructed of trading plan name and pair
    const tp_unique_id = body?.trading_plan_id + '_' + body?.pair;

    // check if trading plan pair exists on database
    // if not, create
    const doc = await adminDb
      .collection('trading_plan_pair')
      .doc(tp_unique_id)
      .get();
    if (!doc.exists) {
      try {
        console.log(
          `No such document! id ::: ${body?.trading_plan_id || ''
          }, timestamp : `,
          new Date().getTime(),
          'creating',
          tp_unique_id
        );
        await adminDb.collection('trading_plan_pair').doc(tp_unique_id).set({
          bots_id: [],
          createdAt: new Date(),
          lastUpdated: new Date(),
          pair: body?.pair,
          trading_plan_id: body.trading_plan_id,
        });
        const tradingPlanDoc = await adminDb
          .collection('trading_plan')
          .doc(body.trading_plan_id)
          .get();

        if (!tradingPlanDoc.exists) {
          console.log(
            `trading plan not found, creating ID : ${body.trading_plan_id}`
          );
          await adminDb
            .collection('trading_plans')
            .doc(body.trading_plan_id)
            .set({
              id: body?.trading_plan_id || '',
              name: body?.trading_plan_id || '',
              childrenPairs: FieldValue.arrayUnion(body?.pair),
              createdAt: new Date(),
            });
        }

        return new Response('no bots!', {
          status: 400,
        });
      } catch (error) {
        console.log(error.message);
      }
    }

    // lookup from dca_bots
    const autotraderRef = adminDb.collection('dca_bots');
    const snapshot = await autotraderRef
      .where('trading_plan_pair', 'array-contains', tp_unique_id)
      .where('status', '==', 'ACTIVE')
      .get();
    if (snapshot.empty) {
      console.log(
        `no bots found lookup under ${tp_unique_id} timestamp : `,
        new Date().getTime()
      );
      return Response.json({ status: false, message: 'No bots foundd' });
    }
    let autotraderLookups = [];
    snapshot.forEach((doc) => {
      autotraderLookups.push({ id: doc.id, ...doc.data() });
    });



    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    if (body?.flag === 'testing')
      return new Response(
        JSON.stringify({
          status: true,
        }),
        {
          status: 200,
        }
      );
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG
    // RETURN IF THERE'S TESTING FLAG





    const result = await Promise.allSettled(
      autotraderLookups?.map(async (autotraderData) => {
        const sendBodyTo3Commas = {
          message_type: 'bot',
          bot_id: parseInt(autotraderData.bot_id),
          email_token: body?.email_token,
          delay_seconds: body?.delay_seconds,
          pair: body?.pair,
        };
        if (body?.action) sendBodyTo3Commas.action = body?.action;
        const res = await fetch(threeCommasUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sendBodyTo3Commas),
        });
        const returnValue = await res.text();
        return {
          ...autotraderData,
          ...sendBodyTo3Commas,
          ...returnValue,
          statusCode: res.status,
          sendBodyTo3Commas,
        };
      })
    );
    // return Response.json({
    //   status: 'okelah',
    //   result,
    // });

    if (Array.isArray(result) && result?.length > 0) {
      await Promise.allSettled(
        result?.map(async (x) => {
          let findPreviousBuy = null;

          if (body.action) {
            try {
              let arr = [];
              const snapshot = await adminDb
                .collection('3commas_logs')
                .where('bot_id', '==', x?.value?.sendBodyTo3Commas?.bot_id?.toString() || x?.value?.bot_id?.toString() || '')
                .where('pair', '==', body?.pair)
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get();

              snapshot.forEach((doc) => {
                arr.push({ ...doc.data(), id: doc.id });
              })

              if (arr?.length > 0) findPreviousBuy = arr[0];
            } catch (error) {
              console.log(error.message + '::: error findPreviousBuy')
            }
          }

          const addDataTo3CommasLogs = {
            // from request body
            requestBody: JSON.stringify(body),
            trading_plan_id: body?.trading_plan_id,
            pair: body?.pair || '',
            price: body?.price || 0,
            timeframe: body?.timeframe || '',
            timestamp: body?.timestamp || '',
            createdAt: new Date(),
            response: x,
            autotradePostBody: x?.sendBodyTo3Commas || null,
            webhookId: addWebhookResult?.id || '',
            bot_id:
              x?.value?.sendBodyTo3Commas?.bot_id?.toString() ||
              x?.value?.bot_id?.toString() ||
              '',
            type: 'autotrade',
            exchange_thumbnail: x?.value?.exchange_thumbnail || '',
            exchange_name: x?.value?.exchange_name || '',
            name: x?.value?.name || '',
            email: x?.value?.email || '',
            uid: x?.value?.uid || '',
            autotrader_name:
              x?.autotrader_name ||
              moment.unix(x?.value?.createdAt?.seconds).format('YYYY-MM-DD') +
              '-' +
              x?.value?.createdAt?.seconds,
            action: body?.action ? 'SELL' : 'BUY',
          };

          if (findPreviousBuy) {
            addDataTo3CommasLogs.pnl = parseFloat(body?.price) - parseFloat(findPreviousBuy?.price) || 0;
            addDataTo3CommasLogs.profit_percent = (100 * (parseFloat(body?.price) - parseFloat(findPreviousBuy?.price)) / parseFloat(findPreviousBuy?.price)) || 0;
            addDataTo3CommasLogs.previousBuyId = findPreviousBuy?.id || '';
          }

          await adminDb.collection('3commas_logs').add(addDataTo3CommasLogs);
        })
      );

      //------------------------------ SEND EMAIL ------------------------------
      //------------------------------ SEND EMAIL ------------------------------
      //------------------------------ SEND EMAIL ------------------------------
      //------------------------------ SEND EMAIL ------------------------------
      //------------------------------ SEND EMAIL ------------------------------
      //------------------------------ SEND EMAIL ------------------------------
      const emailNotificationBody = {
        sender: {
          email: 'info@byscript.io',
          name: 'byScript.io',
        },
        subject: 'Trade Executed -byScript',
        htmlContent: `<!DOCTYPE html>
      <html><body><h1>My Trade executed on byscript</h1>
      <p>PAIR: ${body?.pair}</p>
      <br />
      <p>TRADING PLAN : ${body?.trading_plan_id}</p>
      <br />
      <p>PRICE : ${body?.price}</p>
      <br />
      <p>SIDE : ${body?.action ? 'SELL' : 'BUY'}</p>
      <br />
      </body></html>`,
        messageVersions: result?.map((x) => {
          return {
            to: [
              {
                name: x?.value?.name || '',
                email: x?.value?.email || '',
              },
            ],
            htmlContent: tradeExecutedTemplate({
              autotrader_name:
                x?.autotrader_name ||
                moment.unix(x?.value?.createdAt?.seconds).format('YYYY-MM-DD') +
                '-' +
                x?.value?.createdAt?.seconds,
              exchange_thumbnail: x?.value?.exchange_thumbnail || '',
              trading_plan_id: body?.trading_plan_id,
              signal_type: body?.action ? 'SELL' : 'BUY',
              tradeAmount: x?.tradeAmount || '-',
              price: body?.price || '',
              pair: body?.pair || '',
            }),
            subject: `Trade Executed ${body?.pair || ''} - byScript`,
          };
        }),
      };
      const resEmail = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'post',
        body: JSON.stringify(emailNotificationBody),
        headers: {
          accept: 'application/json',
          // eslint-disable-next-line no-undef
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json',
        },
      });
      const resultEmail = await resEmail.json();
      console.log(JSON.stringify(resultEmail), 'resultEMAIL');

      //------------------------------ SEND EMAIL END ------------------------------
      //------------------------------ SEND EMAIL END ------------------------------
      //------------------------------ SEND EMAIL END ------------------------------
      //------------------------------ SEND EMAIL END ------------------------------
      //------------------------------ SEND EMAIL END ------------------------------
      //------------------------------ SEND EMAIL END ------------------------------
      await Promise.all(
        result?.map(async (x) => {
          const emailBody = {
            sender: {
              name: 'byScript.io',
              email: 'info@byscript.io',
            },
            to: [
              {
                email: x?.value?.email || '',
                name: x?.value?.name || '',
              },
            ],
            subject: `Trade Executed ${body?.pair || ''} - byScript`,
            htmlContent: tradeExecutedTemplate({
              autotrader_name:
                x?.autotrader_name ||
                moment.unix(x?.value?.createdAt?.seconds).format('YYYY-MM-DD') +
                '-' +
                x?.value?.createdAt?.seconds,
              exchange_thumbnail: x?.value?.exchange_thumbnail || '',
              trading_plan_id: body?.trading_plan_id,
              signal_type: body?.action ? 'SELL' : 'BUY',
              tradeAmount: x?.tradeAmount || '-',
              price: body?.price || '',
              pair: body?.pair || '',
            }),
          };
          await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'post',
            body: JSON.stringify(emailBody),
            headers: {
              accept: 'application/json',
              // eslint-disable-next-line no-undef
              'api-key': process.env.BREVO_API_KEY,
              'content-type': 'application/json',
            },
          });
        })
      );
    }

    return new Response('ok', {
      status: 200,
    });
  } catch (error) {
    console.log(error.message, 'error autotrade');
    return new Response(error.message, {
      status: 400,
    });
  }
}
