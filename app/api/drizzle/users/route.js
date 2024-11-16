import { users } from '@/app/drizzle/schema';
import postgresDb from '@/lib/db';
import { adminDb } from '@/lib/firebase-admin-config';

export async function GET() {
  try {
    let arr = [];
    const snapshot = await adminDb.collection('customers').limit(10).get();
    snapshot.forEach((doc) => {
      arr.push({ ...doc.data(), id: doc.id });
    });

    const arrWithUid = await Promise.all(
      arr.map(async (customer) => {
        if (!customer?.uid) {
          let arr2 = [];
          const snapshot2 = await adminDb
            .collection('users')
            .where('email', '==', customer?.email)
            .limit(1)
            .get();
          snapshot2.forEach((doc2) => {
            arr2.push({ ...doc2.data(), id: doc2.id });
          });
          return { ...customer, uid: arr2[0]?.uid };
        }
        return { ...customer };
      })
    );

    arr = arr.map((customer) => {
      return {  name : customer?.name,uid: customer?.uid || null };
    })
    const result = await postgresDb.select().from(users);
    return Response.json({
      status: true,
      data: { users: result, customers: arr, arrWithUid },
    });
  } catch (error) {
    return Response.json({ status: false, message: error.message });
  }
}
