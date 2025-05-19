import { adminDb } from "@/lib/firebase-admin-config";


export async function POST(request) {
  try {
    const body = await request.json();
    const doc = await adminDb
      .collection('webhooks')
      .doc('bmuUqb3RWR1C2iigf2db')
      .get();
      const raw = doc.data().rawSignal;
    return Response.json({
      added : JSON.parse(raw)
    })
  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}