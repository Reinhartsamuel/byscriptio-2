import { users } from '@/app/drizzle/schema';
import postgresDb from '@/lib/db';
import { adminDb } from '@/lib/firebase-admin-config';

export async function GET() {
  try {
    // let customersArr = [];
    // const snapshot = await adminDb.collection('customers').get();
    // snapshot.forEach((doc) => {
    //   customersArr.push({ ...doc.data(), id: doc.id });
    // });

    // const resAddUserPostgres = await Promise.all(
    //   customersArr.map(async (customer) => {
    //     return await postgresDb
    //       .insert(users)
    //       .values({ 
    //         auth_uid:customer.uid || '',
    //         auth_provider:'google',
    //         name:customer.name,
    //         email:customer.email,
    //         verified:false,
    //         no_of_logins:customer.numberOfLogin,
    //         avatar:customer.photoURL,
    //         background_photo:'',
    //         bio:'',
    //         external_customer_id :customer.id,
    //       })
    //   })
    // );


    const result = await postgresDb.select().from(users);
    return Response.json({
      status: true,
      // resAddUserPostgres,
      result,
    });
  } catch (error) {
    return Response.json({ status: false, message: error.message });
  }
}
