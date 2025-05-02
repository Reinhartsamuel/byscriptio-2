import { adminDb } from "@/lib/firebase-admin-config";


export async function POST(request) {
  try {
    const body = await request.json();
    const doc = await adminDb
      .collection('dca_bots')
      .doc(body.autotrader_id)
      .get();
    const autotrader = { ...doc.data(), id: doc.id };

    const returnValue = {
        ...autotrader,
    }
    return Response.json({
      status: 'okelah',
      ...returnValue
    })
  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}