import { adminDb } from '@/lib/firebase-admin-config';
import { cookies } from 'next/headers';

// const dummyCustomerDatabase = [
//     { id: '1', name: 'John', affiliatorCustomerId: '9' },
//     { id: '8', name: 'Mikaela', affiliatorCustomerId: '9' },
//     { id: '2', name: 'Jennie', affiliatorCustomerId: '9' },

//     { id: '3', name: 'Michael', affiliatorCustomerId: '2' },
//     { id: '4', name: 'Samuel', affiliatorCustomerId: '2' },
//     { id: '5', name: 'Frank', affiliatorCustomerId: '2' },
//     { id: '11', name: 'Betty', affiliatorCustomerId: '2' },

//     { id: '6', name: 'Susan', affiliatorCustomerId: '11' },
//     { id: '10', name: 'Jamal', affiliatorCustomerId: '11' },

//     { id: '7', name: 'Reinhart', affiliatorCustomerId: '10' },
//     { id: '9', name: 'Abdul' },
// ];
const listOfCustomers = [];

async function getCustomerData(id) {
    const customerRef = adminDb.collection('customers').doc(id);
    const doc = await customerRef.get();
    if (!doc.exists) {
      return null;
    } else {
      return {id : doc.id, ...doc.data()};
    }
}

async function getAffiliateTree(customers, affiliatorId) {
    console.log('getAffiliateTree');
    let level = 1;
    const affiliatorData = await getCustomerData(affiliatorId);
    customers.push({
      ...affiliatorData,
      level,
    });
    if (affiliatorData?.affiliatorCustomerId) {
      for (const customer of customers) {
        customer.level += 1;
      }
      await getAffiliateTree(customers, affiliatorData?.affiliatorCustomerId);
    } else {
      return;
    }
}

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const body = await request.json();

    const affiliatorCustomerId =
      body?.affiliatorCustomerId || cookieStore.get('affiliateId')?.value;

    // obtain affiliate level for commision calculation
    await getAffiliateTree(listOfCustomers, affiliatorCustomerId);
    const finalAffiliatorData = listOfCustomers.find(
      (customer) => customer.id === affiliatorCustomerId
    );

    // add to firestore
    const newCustomerData = {
      name: body?.name || '',
      email: body?.email || '',
      phone: '',
      lastLogin: new Date(),
      numberOfLogin: body?.numberOfLogin || 1,
      createdAt: new Date(),
      uid: body?.uid || '',
      isNewUser: body?.isNewUser || true,
      photoURL: body?.photoURL || '',
      token: body?.token || null,
      affiliatorCustomerId,
      affiliateLevel: finalAffiliatorData?.level || 1,
    };

    // console.log(body, 'body');
    // console.log(moment.unix(body?.createdAt?.seconds).toDate(),'moment.unix(body?.createdAt?.seconds).toDate()');
    // console.log(newCustomerData, 'newCustomerData');
    // console.log(listOfCustomers, 'listOfCustomers');
    // console.log(finalAffiliatorData, 'finalAffiliatorData');
    if (finalAffiliatorData) newCustomerData.affiliator = finalAffiliatorData;
    const resAdd = await adminDb.collection('customers').add(newCustomerData);
    const customerId = resAdd?.id;
    console.log(resAdd?.id, 'resAdd?.id');
    return Response.json({
      status: true,
      customerId,
    });
  } catch (error) {
    console.log(error.message, 'error');
    return new Response(
      JSON.stringify({ status: false, message: error.message }),
      { status: 500 }
    );
  }
}
