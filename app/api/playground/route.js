import { adminDb } from '@/lib/firebase-admin-config';

export async function GET() {
  try {
    const arr = [];
    const snapshot = await adminDb
      .collection('exchange_accounts')
      .where('exchange_thumbnail', '==', 'https://3commas.cdn.prismic.io/3commas/9f0f9956-95a9-4b6c-9ed9-4be570d96e52_gateio_logo.svg')
      .get();

    snapshot.forEach((doc) => {
      arr.push({ id: doc.id, ...doc.data() });
    });

  //  const resultPromise = await Promise.all(
  //     arr.map(async (exchange) => {
  //       await adminDb.collection('exchange_accounts').doc(exchange.id).update({
  //         exchange_thumbnail: 'https://static.airpackapp.com/fe-next/homepage/prod/_next/static/media/open_sesame_night.47e06968.png?w=750&q=75'
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
