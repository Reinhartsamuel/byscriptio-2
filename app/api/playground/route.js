import { adminDb } from "@/lib/firebase-admin-config";


export async function GET() {
  try {
    let result = [];
    // const querySnapshot = await adminDb
    //   .collection('3commas_logs')
    //   .where('action', '==', 'FORCE_SELL')
    //   .where('status_type', '==', 'waiting_targets')
    //   .limit(2)
    //   .get();

      const snapshot = await adminDb
      .collection('3commas_logs')
      .where('action', '==', 'FORCE_SELL')
      .where('status_type', '==', 'waiting_targets')
      .count()
      .get();
      console.log(snapshot.data().count);
    // querySnapshot.forEach((doc) => {
    //   result.push({ ...doc.data(), id: doc.id });
    // })
    // await Promise.all(result.map(async (item) => {
    //   console.log(`=====\nupdating action on id ${item.id}\n name : ${item.name}\n pair : ${item.pair}`)
    //   await adminDb
    //   .collection('3commas_logs')
    //   .doc(item.id)
    //   .update({
    //     action : 'SELL',
    //     forced:true
    //   })
    // }))

    return Response.json({
      result
    })
  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}