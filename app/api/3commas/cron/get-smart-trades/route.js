import { redisClient } from "@/app/config/redis";
import generateSignatureRsa from "@/app/utils/generateSignatureRsa";
import trackIp from "@/app/utils/trackIp";
import { adminDb } from "@/lib/firebase-admin-config";
export const maxDuration = 300; // This function can run for a maximum of 300 seconds
const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = "https://api.3commas.io";



async function retrieveSmartTrades(page = 1) {
  console.log(`retrieving smart trade PAGE ${page}`)
  const queryParams =
    "/public/api" +
    `/v2/smart_trades?per_page=100&page=${page}&status=active&order_by=updated_at`;
  const finalUrl = baseUrl + queryParams;
  let signatureMessage = queryParams;
  const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      APIKEY: API_KEY,
      Signature: signature,
    },
  };
  const response = await fetch(finalUrl, config);
  const data = await response.json();
  const error = data?.error;
  const error_attributes = data?.error_attributes;
  const error_description = data?.error_description;
  // console.log(
  //   data?.map((x) => x.id),
  //   "data.map((x) => x.id), these are smart trade ids to be upadated",
  // );
  console.log(error, "error");
  console.log(error_attributes, "error_attributes");
  console.log(error_description, "error_description");
  // return new Response('ok')
  if (error) {
    console.log(error, error_attributes, error_description);
    throw new Error(error)
  }
  return data;
}

export async function POST(request) {
  try {
    trackIp(request);

    let q = adminDb
      .collection("3commas_logs")
      .where("status_type", "==", "waiting_targets");
    const snapshot = await q.count().get();
    console.log("number of waiting targets::", snapshot.data().count);


    let pages = 1;
    if (snapshot.data().count > 100) {
      pages = Math.ceil(snapshot.data().count / 100);
    }
    const newArray = new Array(pages).fill('');



    // 1. get latest 100 all status from 3commas
    const promises = newArray.map(async (page, index) => await retrieveSmartTrades(index + 1));
    const arrays = await Promise.allSettled(promises);
    let aggregatedArrays = []; // => this is single source of truth




    arrays.forEach((x) => {
      if (x.status === 'fulfilled') {
        const value = x.value;
        value.forEach((y) => aggregatedArrays.push(y));
      }
    });
    const redisTrades = await redisClient.keys('smart_trade_id:*');
    const redisSmartTradesId = new Set(redisTrades.map((key) => key.split(':')[1]));

    const threeCommasSmartTradesId = new Set(aggregatedArrays.map((trade) => trade.id));

    const availableIn3CommasButNotInRedis = new Set(
      [...threeCommasSmartTradesId]
        .filter((id) => !redisSmartTradesId.has(id))
    ); // this has to be added to redis

    const availableInRedisButNotInThreeCommas = new Set(
      [...redisSmartTradesId]
        .filter((id) => !threeCommasSmartTradesId.has(id))
    ); // this needs to be checked to 3commas by calling get detail of 3commas api



    // // 2. update corresponding trades to the database
    // const result = await Promise.allSettled(
    //   data?.map(async (smartTrade) => {
    //     console.log(
    //       "processing smart trade with id :",
    //       smartTrade.id,
    //       smartTrade,
    //     );
    //     let searchCorrespondingTrade = [];
    //     const querySnapshot = await adminDb
    //       .collection("3commas_logs")
    //       .where("smart_trade_id", "==", String(smartTrade.id))
    //       .get();
    //     querySnapshot.forEach((doc) => {
    //       searchCorrespondingTrade.push({ ...doc.data(), id: doc.id });
    //     });
    //     console.log(
    //       `read searchCorrespondingTrade : ${searchCorrespondingTrade?.length}`,
    //     );
    //     searchCorrespondingTrade = searchCorrespondingTrade.filter(
    //       (x) => !x.already_updated,
    //     );

    //     await Promise.all(
    //       searchCorrespondingTrade?.map(async (x) => {
    //         console.log(
    //           `updating smart trade id ${smartTrade.id} to 3commas_logs doc id ${x.id}`,
    //         );
    //         const withoutId = JSON.parse(JSON.stringify(smartTrade));
    //         delete withoutId.id;
    //         delete withoutId.pair;

    //         const dataToUpdate = {
    //           ...withoutId,
    //           status_type: withoutId?.status?.type || "",
    //         };
    //         if (
    //           smartTrade?.status?.type === "panic_sold" ||
    //           smartTrade?.status?.type === "failed"
    //         ) {
    //           dataToUpdate.already_updated = true;

    //           if (smartTrade?.profit?.usd && smartTrade?.autocompound) {
    //             // update initialBalance
    //             const docc = await adminDb
    //               .collection("dca_bots")
    //               .doc(x.autotrader_id)
    //               .get();
    //             const bot = { ...docc.data(), id: docc.id };
    //             await adminDb
    //               .collection("dca_bots")
    //               .doc(x.autotrader_id)
    //               .update({
    //                 tradeAmount:
    //                   parseFloat(bot?.tradeAmount) +
    //                   parseFloat(smartTrade?.profit?.usd),
    //                 updatedAt: new Date(),
    //               });
    //           }
    //         }
    //         if (x.id) {
    //           const update = await adminDb
    //             .collection("3commas_logs")
    //             .doc(x.id)
    //             .update(dataToUpdate);
    //           console.log(
    //             `update: ${update}, smart trade id ${smartTrade.id} to 3commas_logs doc id ${x.id} is updated`,
    //           );
    //         } else {
    //           console.log(
    //             `NOOOOO smart trade id ${smartTrade.id} to 3commas_logs doc id ${x.id} is not updated`,
    //           );
    //         }
    //       }),
    //     );
    //   }),
    // );
    return Response.json({
      // newArray,
      // status: true,
      // aggregatedArrays,
      // pages,
      // length:aggregatedArrays.length,
      // arrays,
      // activeSmartTradesOnDatabase : snapshot.data().count
      // data,
      // result,
    });
  } catch (error) {
    console.log(error, "error cron");
    return new Response(
      JSON.stringify({
        status: false,
        error: error.message,
      }),
      { status: 500 },
    );
  }
}
