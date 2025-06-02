import { adminDb } from "@/lib/firebase-admin-config";
import { Timestamp } from "firebase-admin/firestore";
import moment from "moment";


function getMostRecentSubscriptions(subscriptionsArray) {
  const userMap = {};

  for (const sub of subscriptionsArray) {
    const customerId = sub.customerId;
    const createdAt = sub.createdAt?._seconds ? new Date(sub.createdAt._seconds * 1000) : new Date();

    if (!userMap[customerId] || new Date(userMap[customerId].createdAt._seconds * 1000) < createdAt) {
      userMap[customerId] = sub;
    }
  }

  // Convert map back to an array
  return Object.values(userMap);
}

export async function GET() {

  try {
    // const processed = getMostRecentSubscriptions(DATA).map(sub => ({
    //   uid: sub.uid,
    //   customerId : sub.customerId,
    //   paymentStatus: sub.paymentStatus,
    //   expiredAt: sub.expiredAt,
    //   productName: sub.productName,
    //   name : sub.name,
    //   isPremium:sub.expiredAt._seconds > moment().unix(),
    //   comparison : `now ${moment().format('llll')} expired ${moment.unix(sub.expiredAt._seconds).format('llll')}`,
    //   lastSubscriptionId : sub.id
    // }));
    // console.log(`datalength : ${DATA.length}`);

    // const resultPromise = await Promise.allSettled(processed.map(async(sub) => {
    //   try {
    //     return await adminDb.collection('customers').doc(sub.customerId).update({
    //       uid: sub.uid,
    //       paymentStatus: sub.paymentStatus,
    //       productName: sub.productName,
    //       isPremium:sub.expiredAt._seconds > moment().unix(),
    //       lastSubscriptionId : sub.lastSubscriptionId
    //     })
    //   } catch (error) {
    //     console.log(error.message)
    //     throw new Error(error.message)
    //   }
      
    // }))
    // return Response.json({
    //   processed,
    //   resultPromise,
    //   length:processed.length,
    //   status: true,
    // });

  
    let result = [];
    let q = adminDb
      .collection('subscriptions')
      .where('uid', '==', '')

    const querySnapshot = await q
      // .limit(20)
      .get();


    const snapshot = await q
      .count()
      .get();
    console.log(snapshot.data().count);
    querySnapshot.forEach((doc) => {
      result.push({ ...doc.data(), id: doc.id });
    })


    return Response.json({
      result,
      status: true,
    });


  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}