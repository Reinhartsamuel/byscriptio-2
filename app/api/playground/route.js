// import { adminDb } from '@/lib/firebase-admin-config';
// import { FieldValue } from 'firebase-admin/firestore';
// import moment from 'moment';
// import { headers } from 'next/headers';
// import { userAgent } from 'next/server';

// const threeCommasUrl = 'https://app.3commas.io/trade_signal/trading_view';
// export async function GET (request) {
//     try {
//         const test =  userAgent(request);
//         console.log(request.url, 'request.url');
//         console.log(test, 'userAgent');
//         const ipAddress = IP();
//         return Response.json({hello:'world',userAgent:test.ua||'', ipAddress})
//     } catch (error) {
//         return Response.json({ status : false, message : error.message, error },{status : 500});
//     }
// }

// function IP() {
//     const FALLBACK_IP_ADDRESS = '0.0.0.0'
//     const forwardedFor = headers().get('x-forwarded-for')

//     if (forwardedFor) {
//       return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS
//     }

//     return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS
//   }

export async function GET() {
  try {
    // let logsArr = [];

    // const citiesRef = adminDb
    //   .collection('3commas_logs')
    //   .orderBy('createdAt', 'desc')
    //   .limit(50);
    // const snapshot = await citiesRef.get();
    // snapshot.forEach((doc) => {
    //   logsArr.push({ id: doc.id, ...doc.data() });
    // });

    // await Promise.all(
    //   logsArr.map(async (x) => {
    //     let botsArr = [];

    //     const bot_id = x?.bot_id;
    //     console.log(bot_id, 'bot_id');
    //     console.log(typeof bot_id, 'typeof bot_id');

    //     const citiesRef = adminDb
    //       .collection('dca_bots')
    //       .where('bot_id', '==', bot_id);
    //     const snapshot = await citiesRef.get();
    //     snapshot.forEach((doc) => {
    //       botsArr.push({ id: doc.id, ...doc.data() });
    //     });
    //     const botData = botsArr[0];
    //     // console.log(
    //     //   'this is the logs id:::::',
    //     //   x.id,
    //     //   'this is the bot id and bot_id::::',
    //     //   botData?.id,
    //     //   botData?.bot_id,
    //     //   'uid orang::::',
    //     //   botData?.uid,
    //     //   botData?.email,
    //     //   botData?.name
    //     // );
    //     console.log('botData::::::',botData);
    //     const cityRef = adminDb.collection('3commas_logs').doc(x?.id);
    //     await cityRef.update({
    //       name: botData?.name || '',
    //       email: botData?.email || '',
    //       uid: botData?.uid || '',
    //       exchange_name :botData?.exchange_name || '',
    //           exchange_thumbnail :botData?.exchange_thumbnail || '',
    //           autotraderCreatedAt :botData?.createdAt || '',
    //     });
    //   })
    // );
    // return Response.json({
    //   status: 'success',
    //   data: logsArr,
    // });

  return Response.json({
    status : 'okelah',
    // arr
  })

  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const addWebhookResult = await adminDb.collection('webhooks').add({
//       ...body,
//       type: 'autotrade',
//       createdAt: new Date(),
//       // result: result.map((x) => x?.status),
//     });
//     // console.log(body);

//     // trading_plan_id is constructed of trading plan name and pair
//     const tp_unique_id = body?.trading_plan_id + '_' + body?.pair;

//     // check if trading plan pair exists on database
//     // if not, create
//     const doc = await adminDb
//       .collection('trading_plan_pair')
//       .doc(tp_unique_id)
//       .get();
//     if (!doc.exists) {
//       try {
//         console.log(
//           `No such document! id ::: ${
//             body?.trading_plan_id || ''
//           }, timestamp : `,
//           new Date().getTime(),
//           'creating',
//           tp_unique_id
//         );
//         await adminDb.collection('trading_plan_pair').doc(tp_unique_id).set({
//           bots_id: [],
//           createdAt: new Date(),
//           lastUpdated: new Date(),
//           pair: body?.pair,
//           trading_plan_id: body.trading_plan_id,
//         });
//         const tradingPlanDoc = await adminDb
//           .collection('trading_plan')
//           .doc(body.trading_plan_id)
//           .get();

//         if (!tradingPlanDoc.exists) {
//           console.log(
//             `trading plan not found, creating ID : ${body.trading_plan_id}`
//           );
//           await adminDb
//             .collection('trading_plans')
//             .doc(body.trading_plan_id)
//             .set({
//               id: body?.trading_plan_id || '',
//               name: body?.trading_plan_id || '',
//               childrenPairs: FieldValue.arrayUnion(body?.pair),
//               createdAt: new Date(),
//             });
//         }

//         return new Response('no bots!', {
//           status: 400,
//         });
//       } catch (error) {
//         console.log(error.message);
//       }
//     }

//     // lookup from dca_bots
//     const autotraderRef = adminDb.collection('dca_bots');
//     const snapshot = await autotraderRef
//       .where('trading_plan_pair', 'array-contains', tp_unique_id)
//       .where('status', '==', 'ACTIVE')
//       .get();
//     if (snapshot.empty) {
//       console.log(
//         `no bots found lookup under ${tp_unique_id} timestamp : `,
//         new Date().getTime()
//       );
//       return Response.json({ status: false, message: 'No bots foundd' });
//     }
//     let autotraderLookups = [];
//     snapshot.forEach((doc) => {
//       console.log(doc.id, '=>', doc.data());
//       autotraderLookups.push({ id: doc.id, ...doc.data() });
//     });

//     const result = await Promise.allSettled(
//       autotraderLookups?.map(async (autotraderData, i) => {
//         const sendBodyTo3Commas = {
//           message_type: 'bot',
//           bot_id: parseInt(autotraderData.bot_id),
//           email_token: body?.email_token,
//           delay_seconds: body?.delay_seconds,
//           pair: body?.pair,
//         };
//         if (body?.action) sendBodyTo3Commas.action = body?.action;
//         // const res = await fetch(threeCommasUrl, {
//         //   method: 'POST',
//         //   headers: {
//         //     'Content-Type': 'application/json',
//         //   },
//         //   body: JSON.stringify(sendBodyTo3Commas),
//         // });
//         // const returnValue = await res.text();
//         // return { ...returnValue, statusCode: res.status, sendBodyTo3Commas };
//         return { ...autotraderData, ...sendBodyTo3Commas,sendBodyTo3Commas };
//       })
//     );
//     // return Response.json({
//     //   status: 'okelah',
//     //   result,
//     // });

//     if (Array.isArray(result) && result?.length > 0) {
//       await Promise.allSettled(
//         result?.map(async (x) => {
//           await adminDb.collection('3commas_logs').add({
//             // from request body
//             requestBody: JSON.stringify(body),
//             trading_plan_id: body?.trading_plan_id,
//             pair: body?.pair || '',
//             timeframe: body?.timeframe || '',
//             timestamp: body?.timestamp || '',
//             createdAt: new Date(),
//             response: x,
//             autotradePostBody: x?.sendBodyTo3Commas || null,
//             webhookId: addWebhookResult?.id || '',
//             bot_id: x?.value?.sendBodyTo3Commas?.bot_id?.toString() || x?.value?.bot_id?.toString() || '',
//             type: 'autotrade',
//             exchange_thumbnail: x?.value?.exchange_thumbnail || '',
//             exchange_name : x?.value?.exchange_name || '',
//             name: x?.value?.name || '',
//             email : x?.value?.email || '',
//             uid : x?.value?.uid || '',
//             autotrader_name :  x?.autotrader_name || moment.unix(x?.value?.createdAt?.seconds).format('YYYY-MM-DD') +
//               '-' +
//               x?.value?.createdAt?.seconds
//           });
//         })
//       );
//     }

//     return new Response('ok', {
//       status: 200,
//     });
//   } catch (error) {
//     console.log(error.message, 'error autotrade');
//     return new Response(error.message, {
//       status: 400,
//     });
//   }
// }
