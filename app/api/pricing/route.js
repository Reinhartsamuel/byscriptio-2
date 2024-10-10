import { adminDb } from '../../../lib/firebase-admin-config';

export async function GET() {
  let arr = [];
  try {
    const productsRef = adminDb.collection('products').orderBy('amount', 'asc');
    const snapshot = await productsRef.where('type', '==', 'plan').get();
  
    snapshot.forEach((doc) => {
      arr.push({id : doc.id, ...doc.data()})
    });
    return Response.json({
      status: true,
      data: arr,
    });
  } catch (error) {
    return Response.json({
        error : error.message,
        status: false,
        data: arr,
      });
  }
}
