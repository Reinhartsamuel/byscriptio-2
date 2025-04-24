import { adminDb } from "@/lib/firebase-admin-config";

export async function GET () {
  try {
    const doc = await adminDb
    .collection('3commas_logs')
    .doc('OWL1dxRHhUy0FTk4yrt6')
    .get();
    const memek = {};
    const keys = Object.keys({...doc.data(), id: doc.id}).sort();
    keys.forEach((key) => {
        memek[key] = doc.data()[key];
    });
    return Response.json({
      ...memek
    })
  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}

// import generateSignatureRsa from '@/app/utils/generateSignatureRsa';
// import { promises as fs } from 'fs';

// const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
// const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
// const MAX_EXECUTION_RETRIES = 2;
// const baseUrl = 'https://api.3commas.io';

// const TRADE_AMOUNT = 20; // USDT

// export async function POST(request) {
//   const body = await request.json();
//   const file = await fs.readFile(process.cwd() + '/app/api/playground/mockDatabase.json', 'utf8');
//   try {

//     const mockDatabase = JSON.parse(file);
//     // console.log(autotrader, 'autotrader kuda')
//     const bodySend = {
//       account_id: 33148709,
//       // account_id: autotrader.exchange_external_id,
//       pair: body.pair,
//       instant: false,
//       position: {
//         type: body.type,
//         units: {
//           value:TRADE_AMOUNT
//           // value: String(TRADE_AMOUNT / parseFloat(body.price)) // amount in token, not in usd, so (amountUsd/price)
//           // value: String(parseFloat(autotrader.tradeAmount) / parseFloat(body.price)) // amount in token, not in usd, so (amountUsd/price)
//         },
//         order_type: "market"
//       },
//       leverage: {
//         enabled: true,
//         type: "isolated",
//         value: "1"
//       },
//       take_profit: {
//         enabled: false,
//       },
//       stop_loss: {
//         enabled: false,
//       },
//     }

//     // 2. find latest trade history on 3commas_logs where same trading_plan_id and pair
//     const responseCloseMarket = await closePreviousTrade({
//       mockDatabase,
//       body,
//       bodySend,
//     });

//     // 4. execute smart trade
//     // console.log(`Executing smart trade for ${autotrader.id}`)
//     const responseExecute = await executeNewTrade({
//       bodySend,
//       body,
//       nonce: 1,
//       updateTradeAmount: responseCloseMarket?.updateTradeAmount
//     })

//     const returnValue = {
//       // latestTradeHistory,
//       responseExecute,
//       responseCloseMarket,
//     }

//     return Response.json({
//       status: 'okelah',
//       ...returnValue
//     });
//   } catch (error) {
//     return Response.json({
//       error: error.message,
//       status: false,
//     });
//   }
// }



// async function getStmartTradeStatus(id) {
//   const totalParams = `/public/api/v2/smart_trades/${id}`;
//   const finalUrl = baseUrl + totalParams;
//   const signatureMessage = totalParams;
//   const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
//   const response = await fetch(finalUrl, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       APIKEY: API_KEY,
//       Signature: signature,
//     }
//   });
//   const data = await response.json();
//   return {
//     status: data.status,
//     id
//   }
// }


// async function closePreviousTrade({
//   mockDatabase,
//   body,
//   bodySend,
// }) {
//   let arr = [];
//   try {
//     // const latestTradeHistory = await adminDb
//     //     .collection('3commas_logs')
//     //     .where('autotrader_id', '==', autotrader.id)
//     //     .where('pair', '==', body.pair)
//     //     .where('trading_plan_id', '==', body.trading_plan_id)
//     //     .orderBy('createdAt', 'desc')
//     //     .limit(1)
//     //     .get();
//     // latestTradeHistory.forEach((doc) => {
//     //     arr.push({ ...doc.data(), id: doc.id });
//     // })
//     // console.log(arr, 'arr');

//     //instead of fetching the firestore database, fetch from local file in this same directory, from "data"
//     arr = mockDatabase.filter((item) => {
//       return item.pair === body.pair &&
//         item.trading_plan_id === body.trading_plan_id;
//     }).sort((a, b) => {
//       return new Date(parseInt(b.createdAt)) - new Date(parseInt(a.createdAt));
//     });
//   } catch (error) {
//     console.log(error.message, 'error finding latest trade history on 3commas_logs where same trading_plan_id and pair', JSON.stringify(body));
//     return new Response('Failed to find latest trade history on 3commas_logs where same trading_plan_id and pair', { status: 500 });
//   }

//   // 3. if the latest trade history is not closed, close first
//   // by close_at_market_price function
//   if (
//     arr.length > 0 &&
//     arr[0].status.type
//     !== 'panic_sell_pending' && arr[0].status.type !== 'panic_sold') {
//     // check status of the latest trade history
//     const { status } = await getStmartTradeStatus(arr[0].smart_trade_id);
//     console.log(status, arr[0].smart_trade_id, 'this is status weve longing for');
//     if (status?.type !== 'panic_sold') {

//       console.log(`found ${arr[0].smart_trade_id} trade, trying to close first`);
//       console.log(`trying to close trade ${arr[0].smart_trade_id}`)
//       // close at market price function here
//       // console.log(`trying to close trade ${arr[0].smart_trade_id}`)
//       const queryParamsCloseMarket = `/public/api/v2/smart_trades/${arr[0].smart_trade_id}/close_by_market`;
//       console.log(`queryParamsCloseMarket: ${queryParamsCloseMarket}`)
//       const finalUrlCloseMarket = baseUrl + queryParamsCloseMarket;
//       const signatureMessage = queryParamsCloseMarket;
//       const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
//       const response2 = await fetch(finalUrlCloseMarket, {
//         method: 'POST',
//         // body: JSON.stringify({}),
//         headers: {
//           'Content-Type': 'application/json',
//           APIKEY: API_KEY,
//           Signature: signature,
//         }
//       });
//       const responseCloseMarket = await response2.json();
//       if (responseCloseMarket.error || responseCloseMarket.error_description) {
//         console.log('Failed to close trade', responseCloseMarket, JSON.stringify(body));
//         throw new Error('Failed to close trade');
//       }
//       const smart_trade_id = String(responseCloseMarket.id || '');
//       delete responseCloseMarket.id;
//       // this is for adding 3commas_logs
//       const sendDataTo3CommasLogs = {
//         ...responseCloseMarket,
//         name: 'reinhart',
//         email: 'reinhartsams@gmail.com',
//         uid: 'tidakada',
//         smart_trade_id,
//         autotrader_id: 'xx',
//         createdAt: new Date().getTime().toString(),
//         type: 'autotrade',
//         trading_plan_id: body.trading_plan_id,
//         action: `CLOSE_${body.type === 'sell' ? 'SELL' : 'BUY'}`,
//         pair: body.pair,
//         previousBuyId: arr[0]?.id || '',
//         smart_trade: true,
//         requestBody: bodySend,
//         id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), //create random 20 character string
//       }
//       const updateTradeAmount = parseFloat(responseCloseMarket.margin.amount) + parseFloat(responseCloseMarket.profit.usd);
//       console.log(updateTradeAmount, 'updateTradeAmount')
//       // if (!isNaN(updateTradeAmount)) {
//       //     bodySend.position.units.value = String(updateTradeAmount);
//       //     sendDataTo3CommasLogs.updatedBalance = updateTradeAmount;
//       //     const updateAutotrader = await adminDb
//       //         .collection('dca_bots')
//       //         .doc(autotrader.id)
//       //         .update({
//       //             tradeAmount: updateTradeAmount
//       //         })
//       //     console.log(updateAutotrader, 'updateAutotrader', JSON.stringify(body));
//       // }
//       // delete responseCloseMarket.pair;
//       // await adminDb
//       //     .collection('3commas_logs')
//       //     .add(sendDataTo3CommasLogs)
//       // append to mockDatabase.json
//       mockDatabase.push(sendDataTo3CommasLogs);
//       await fs.writeFile(process.cwd() + '/app/api/playground/mockDatabase.json', JSON.stringify(mockDatabase));
//       return {...responseCloseMarket, smart_trade_id, updateTradeAmount};
//     }
//     // create a timeout for 10 seconds and add console.log to indicate it's waiting
//     // console.log('waiting for 10 seconds')
//     // await new Promise(resolve => setTimeout(resolve, 5000));
//   } else {
//     console.log('latest trade for this is not found', arr)
//   }
// }


// async function executeNewTrade({
//   bodySend,
//   body,
//   nonce,
//   updateTradeAmount
// }) {
//   const queryParams = `/public/api/v2/smart_trades`;
//   const finalUrl = baseUrl + queryParams;
//   const signatureMessage = queryParams + JSON.stringify(bodySend);
//   const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
//   const updatedBodySend = {
//     ...bodySend,
//     position: {
//         ...bodySend.position,
//         units: {
//             value: updateTradeAmount ? String(updateTradeAmount) : bodySend.position.units.value // check if the previous trade updates the tradeAmount, otherwise use the original tradeAmount
//         }
//     }
// }
// console.log(`executinggggggggg ${JSON.stringify(updatedBodySend)}`)
//   const response2 = await fetch(finalUrl, {
//     method: 'POST',
//     body: JSON.stringify(updatedBodySend),
//     headers: {
//       'Content-Type': 'application/json',
//       APIKEY: API_KEY,
//       Signature: signature,
//     }
//   });
//   const responseExecute = await response2.json();
//   // result of execute smart trade, update to 3commas_logs
//   // if error, return error and console log
//   if (responseExecute.error || responseExecute.error_description) {
//     console.log('Failed to execute smart trade', responseExecute);
//     if (nonce <= MAX_EXECUTION_RETRIES) {
//       console.log('retrying execute smart trade', nonce);
//       return await executeNewTrade({
//         bodySend,
//         body,
//         nonce: nonce + 1,
//         updateTradeAmount
//       }); // retry 2 times
//     }
//     return {
//       error: responseExecute.error + ', ' + responseExecute.error_description,
//       error_attributes: responseExecute.error_attributes
//     }
//   }
//   const smart_trade_id = String(responseExecute.id || '');
//   delete responseExecute.id;
//   delete responseExecute.pair;
//   // const res = await adminDb
//   //     .collection('3commas_logs')
//   //     .add({
//   //       name: 'reinhart',
//   //       email:  'reinhartsams@gmail.com',
//   //       uid:  'tidakada',
//   //         trading_plan_id: body.trading_plan_id,
//   //         autotrader_id:'xx',
//   //         createdAt: new Date(),
//   //         action: body.type === 'sell' ? 'SELL' : 'BUY',
//   //         type: 'autotrade',
//   //         smart_trade_id,
//   //         exchange_external_id: '33099719',
//   //         exchange_name: 'BINANCE',
//   //         pair: body.pair,
//   //         smart_trade: true,
//   //         ...responseExecute,
//   //         requestId: bodySend,
//   //     })

//   const rereadFile = await fs.readFile(process.cwd() + '/app/api/playground/mockDatabase.json', 'utf8');
//   const rereadArr = JSON.parse(rereadFile);
//   rereadArr.push({
//     ...responseExecute,
//     name: 'reinhart',
//     email: 'reinhartsams@gmail.com',
//     uid: 'tidakada',
//     trading_plan_id: body.trading_plan_id,
//     autotrader_id: 'xx',
//     createdAt: new Date().getTime().toString(),
//     action: body.type === 'sell' ? 'SELL' : 'BUY',
//     type: 'autotrade',
//     smart_trade_id,
//     exchange_external_id: '33099719',
//     exchange_name: 'BINANCE',
//     pair: body.pair,
//     smart_trade: true,
//     requestId: bodySend,
//     id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), //create random 20 character string
//   })

//   await fs.writeFile(process.cwd() + '/app/api/playground/mockDatabase.json', JSON.stringify(rereadArr));
//   return {...responseExecute,smart_trade_id};
// }