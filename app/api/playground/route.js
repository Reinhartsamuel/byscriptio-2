import { redisClient } from "@/app/config/redis";
import generateSignatureRsa from "@/app/utils/generateSignatureRsa";
import trackIp from "@/app/utils/trackIp";
import { adminDb } from "@/lib/firebase-admin-config";
import { NextResponse } from "next/server";

export const maxDuration = 300;

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = "https://api.3commas.io";

// export async function POST(request) {
//   try {
//     trackIp(request);

//     // Step 1: Count waiting targets
//     const q = adminDb
//       .collection("3commas_logs")
//       .where("status_type", "==", "waiting_targets");
//     const snapshot = await q.count().get();
//     console.log("Number of waiting targets:", snapshot.data().count);

//     // Step 2: Fetch smart trades from 3Commas API
//     // let page = 1;
//     const queryParams = `/public/api/v2/smart_trades?per_page=100&page=1&status=active&order_by=updated_at`;
//     const finalUrl = baseUrl + queryParams;

//     const signature = generateSignatureRsa(PRIVATE_KEY, queryParams);
//     const config = {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         APIKEY: API_KEY,
//         Signature: signature,
//       },
//     };

//     const response = await fetch(finalUrl, config);
//     const data = await response.json();

//     if (data.error) {
//       console.error(data.error, data.error_attributes, data.error_description);
//       return Response.json(
//         {
//           error: data.error,
//           error_attributes: data.error_attributes,
//         },
//         { status: 400 },
//       );
//     }

//     // Step 3: Map smart trade IDs
//     const tradeIds = data.map((trade) => String(trade.id));
//     console.log(`Found ${tradeIds.length} smart trade IDs`);

//     // Step 4: Batch query Firestore docs by ID in chunks of 30
//     const chunkSize = 30;
//     const docMap = {};
//     const chunks = [];

//     // Split into chunks of 30
//     for (let i = 0; i < tradeIds.length; i += chunkSize) {
//       chunks.push(tradeIds.slice(i, i + chunkSize));
//     }

//     // Run queries for each chunk
//     for (const chunk of chunks) {
//       const batchQuery = adminDb
//         .collection("3commas_logs")
//         .where("smart_trade_id", "in", chunk);

//       const querySnapshot = await batchQuery.get();

//       querySnapshot.forEach((doc) => {
//         const tradeId = doc.data().smart_trade_id;
//         if (!docMap[tradeId]) docMap[tradeId] = [];
//         docMap[tradeId].push({ ...doc.data(), id: doc.id });
//       });
//     }

//     // // Step 5: Prepare updates
//     // const updatePromises = [];

//     // for (const trade of data) {
//     //   const tradeId = String(trade.id);
//     //   const docsToUpdate =
//     //     docMap[tradeId]?.filter((x) => !x.already_updated) || [];

//     //   for (const doc of docsToUpdate) {
//     //     const withoutIdAndPair = { ...trade };
//     //     delete withoutIdAndPair.id;
//     //     delete withoutIdAndPair.pair;

//     //     const firestoreUpdate = {
//     //       ...withoutIdAndPair,
//     //       status_type: trade?.status?.type || "",
//     //       updated_at: new Date(),
//     //     };

//     //     // Mark as already updated
//     //     if (
//     //       trade?.status?.type === "panic_sold" ||
//     //       trade?.status?.type === "failed"
//     //     ) {
//     //       firestoreUpdate.already_updated = true;

//     //       if (trade?.profit?.usd && trade?.autocompound && doc.autotrader_id) {
//     //         updatePromises.push(
//     //           updateDcaBotBalance(doc.autotrader_id, trade.profit.usd),
//     //         );
//     //       }
//     //     }

//     //     // Update the main log document
//     //     updatePromises.push(
//     //       adminDb
//     //         .collection("3commas_logs")
//     //         .doc(doc.id)
//     //         .update(firestoreUpdate),
//     //     );
//     //   }
//     // }

//     // // Run all updates in parallel
//     // await Promise.all(updatePromises);

//     return Response.json({
//       status: true,
//       count: data.length,
//       data,
//       docMap,
//     });
//   } catch (error) {
//     console.error("Error in cron job:", error);
//     return new Response(
//       JSON.stringify({
//         status: false,
//         error: error.message,
//       }),
//       { status: 500 },
//     );
//   }
// }
//
//
export async function POST(request) {
  try {
    // await redisClient.set("test1", "kudaa");
    const data= await redisClient.get('test1')
    return NextResponse.json({
      status: true,
      message: "Redis set successfully",
      data
    });
  } catch (error) {
    return NextResponse.json({
      status: false,
      error: error.message,
    });
  }
}
