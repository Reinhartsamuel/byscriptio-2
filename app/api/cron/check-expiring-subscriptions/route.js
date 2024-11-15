import { adminDb } from '@/lib/firebase-admin-config';
import moment from 'moment';

export async function GET() {
  // Get the start and end of the current day
  const endOfDay = moment().endOf('day').toDate(); // 23:59:59
  let arr = [];
  try {
    const snapshot = await adminDb
      .collection('subscriptions')
      .where('expiredAt', '<=', endOfDay)
      .get();

    snapshot.forEach((doc) => {
      arr.push({ ...doc.data(), id: doc.id });
    })

    
    return Response.json({
        status : true,
        data : arr,
        length : arr.length
    })
  } catch (error) {
    return Response.json({
        status : 'error',
        message : error.message,
    })
  }
}
