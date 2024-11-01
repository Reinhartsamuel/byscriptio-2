import { adminDb } from '@/lib/firebase-admin-config';

export async function GET(request) {
  try {
    const urlSearchParams = request.nextUrl.searchParams;
    const customerId = urlSearchParams.get('customer_id');
    console.log(customerId, 'customerId');

    const res = await adminDb
      .collection('customers')
      .where('affiliatorCustomerId', '==', customerId)
      .get();

    return new Response(
      JSON.stringify({
        status: true,
        data: res.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ status: false, message: error.message }),
      { status: 500 }
    );
  }
}
