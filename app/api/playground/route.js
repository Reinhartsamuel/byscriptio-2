import { adminDb } from '@/lib/firebase-admin-config';

export async function GET() {
  try {
    const arr = [];
    const snapshot = await adminDb
    .collection('kuda')
    .where('status', '==', ['ACTIVE'])
    .get();

  snapshot.forEach((doc) => {
    arr.push({ id: doc.id, ...doc.data() });
  });

  //  const resultPromise = await Promise.all(
  //     arr.map(async (doc) => {
  //       await adminDb.collection('dca_bots').doc(doc.id).update({
  //         status: 'ACTIVE'
  //       })
  //     }))

    return Response.json({
      status: 'okelah',
      arr,
      // resultPromise,
    });
  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}
