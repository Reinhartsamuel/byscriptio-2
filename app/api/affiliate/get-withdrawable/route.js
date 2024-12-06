import { adminDb } from '@/lib/firebase-admin-config';
import { AggregateField } from 'firebase-admin/firestore';
import moment from 'moment';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');
    if (!customerId) throw new Error('no customer id');

    // STEP 1. FIND LATEST WITHDRAWAL
    let listOfWithdrawals = [];
    const snapshot = await adminDb
      .collection('affiliate_withdrawals')
      .where('customerId', '==', customerId)
      .where('paymentStatus', '==', 'FINISHED')
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
    let coll = adminDb
      .collection('subscriptions')
      .where('affiliatorCustomerId', '==', customerId)
      .where('paymentStatus', '==', 'PAID')

    // Check if listOfWithdrawals is not empty
    if (listOfWithdrawals?.length > 0) {
      console.log('adding one more condition')
      coll = coll.where('createdAt', '>=', listOfWithdrawals[0]?.createdAt);
    }
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
        withdrawable: sumSnapshot.data().affiliateCommissionSum,
        customerId,
        lastWithdrawal: listOfWithdrawals[0],
        listOfWithdrawals,
      },
    });
  } catch (error) {
    return Response.json({ status: false, message: error.message });
  }
}
