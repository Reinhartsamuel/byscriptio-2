import { adminDb } from "@/lib/firebase-admin-config";

export async function getExchangeData(autotrader) {
    if (!autotrader.exchange_external_id) return { market_code: null };
    const arr = [];
    const querySnapshot = await adminDb
        .collection('exchange_accounts')
        .where('external_id', '==', autotrader.exchange_external_id)
        .get();
    querySnapshot.forEach((doc) => {
        arr.push({
            ...doc.data(),
            id: doc.id
        });
    });
    // console.log(arr, 'arr inside getExchangeData');
    if (arr.length === 0) return { market_code: null };
    return arr[0];
}