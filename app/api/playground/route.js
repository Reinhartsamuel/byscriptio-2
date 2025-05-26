import { adminDb } from "@/lib/firebase-admin-config";


export async function GET() {
  try {
    let result = [];
    let q = adminDb
      .collection('webhooks')
      .where('method', '==', 'CREATE')

    const querySnapshot = await q
      .limit(2)
      .get();

    const snapshot = await q
      .count()
      .get();
    console.log(snapshot.data().count);
    querySnapshot.forEach((doc) => {
      result.push({ ...doc.data(), id: doc.id });
    })


    return Response.json({
      result : result.map((x) => ({
        ...x,
        rawObject: JSON.parse(x.rawSignal)
      }))
      
    })
  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}