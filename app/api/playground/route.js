import { adminDb } from "@/lib/firebase-admin-config";


export async function GET(request) {
  try {
    let result = [];
    const querySnapshot = await adminDb
      .collection('3commas_logs')
      .where('status_type', 'in', ['panic_sold', 'waiting_position'])
      .limit(100)
      .get();
    querySnapshot.forEach((doc) => {
      result.push({ ...doc.data(), id: doc.id });
    })

    return Response.json({
      result: result.map((x) => x.status_type)
    })
  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}