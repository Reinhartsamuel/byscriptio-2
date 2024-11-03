import { adminDb } from '@/lib/firebase-admin-config';
import { AggregateField } from 'firebase-admin/firestore';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');

    // STEP 1. FIND LATEST WITHDRAWAL
    let listOfWithdrawals = [];
    const snapshot = await adminDb
      .collection('affiliate_withdrawals')
      .where('customerId', '==', customerId)
      .where('paymentStatus', '==', 'PAID')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();
    snapshot.forEach((doc) => {
      listOfWithdrawals.push({ id: doc.id, ...doc.data() });
    });

    // STEP 2. GET SUBSCRIPTIONS WHERE affiliatorCustomerId == customerId
    // AND paymentStatus == PAID
    // AND createdAt isAfter listOfWithdrawals[0].createdAt
    // SUM affiliateCommission
    const coll = adminDb
      .collection('subscriptions')
      .where('affiliatorCustomerId', '==', customerId)
      .where('paymentStatus', '==', 'PAID')
      .where('createdAt', '>=', listOfWithdrawals[0]?.createdAt);
    const sumAggregateQuery = coll.aggregate({
      affiliateCommissionSum: AggregateField.sum('affiliateCommission'),
    });
    const sumSnapshot = await sumAggregateQuery.get();
    console.log(
      'affiliateCommissionSum: ',
      sumSnapshot.data().affiliateCommissionSum
    );

    return Response.json({
      status: true,
      data: {
        withdrawable :  sumSnapshot.data().affiliateCommissionSum,
        customerId,
        lastWithdrawal : listOfWithdrawals[0],
      },
    });
  } catch (error) {
    return Response.json({ status: false, message: error.message });
  }
}
