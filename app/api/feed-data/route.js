import { admin, adminDb } from "@/lib/firebase-admin-config";

export const maxDuration = 25;

function convertTicker(ticker) {
    const base = "USDT";
    if (ticker.endsWith(base)) {
        const coin = ticker?.slice(0, -base.length);
        return `${base}_${coin}`;
    }
    return ticker; // Return original ticker if it doesn't end with USDT
}

function convertToFirestoreTimestamp(datetimeStr) {
    // Convert the string into a JavaScript Date object (handles timezones correctly)
    if (!datetimeStr) {
        return admin.firestore.Timestamp.now();
    }
    const dateObj = new Date(datetimeStr);

    // Convert to Firestore Timestamp
    return admin.firestore.Timestamp.fromDate(dateObj);
}
export async function POST(request) {
    try {
        const body = await request.json();
        console.log('body:::', body)
        const mergedArray = [];

        const pairNamesArray = Object.keys(body);
        // console.log(pairNamesArray, 'pairNamesArray')
        pairNamesArray.forEach((pairName) => {
            body[pairName].forEach((x) => {
                mergedArray.push({
                    ...x,
                    pair: convertTicker(pairName),
                    time: convertToFirestoreTimestamp(x?.Datetime)
                })
            })
        });
        const result = await Promise.allSettled(
            mergedArray?.map(async (y) => {
                return await adminDb.collection('data_feed').add({
                    ...y,
                    createdAt: new Date()
                })
            }))
        console.log('mergedArray?.length:::', mergedArray?.length);
        console.log('mergedArray:::', mergedArray);

        return Response.json({
            status: true,
            mergedArray,
            result
        })
    } catch (error) {
        console.log(`Returning with error : ${error.message}, statusCode : ${error?.status}`)
        return Response.json({ status: false, message: error.message });
    }
}