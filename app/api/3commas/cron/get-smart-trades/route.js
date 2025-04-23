import { adminDb } from "@/lib/firebase-admin-config";
export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export async function POST() {
    try {
        const { signal } = new AbortController()
        const res = await fetch(`https://byscript.io/api/playground/3commas?time=${new Date().getTime()}`, {
            method: 'POST',
            next: { revalidate: 0 },
            signal,
            body: JSON.stringify({
                "queryParams": "/v2/smart_trades?per_page=100&page=1&status=all&order_by=updated_at",
                "method": "GET"
            })
        });
        const { data, error, error_attributes, error_description } = await res.json();
        console.log( data?.map((x) => x.id), 'data.map((x) => x.id), these are smart trade ids to be upadated' )
        console.log( error, 'error')
        console.log( error_attributes, 'error_attributes')
        console.log( error_description, 'error_description')
        // return new Response('ok')
        if (error) {
            console.log(error, error_attributes, error_description)
            return Response.json({
                error,
                error_attributes
            })
        }

        const result = await Promise.allSettled(data?.map(async (smartTrade) => {
            console.log('processing smart trade with id :', smartTrade.id, smartTrade);
            let searchCorrespondingTrade = [];
            const querySnapshot = await adminDb
                .collection('3commas_logs')
                .where('smart_trade_id', '==', String(smartTrade.id))
                .get();
            querySnapshot.forEach((doc) => {
                searchCorrespondingTrade.push({ id: doc.id, ...doc.data() })
            });
            searchCorrespondingTrade = searchCorrespondingTrade.filter((x) => !x.already_updated);

            await Promise.all(searchCorrespondingTrade?.map(async (x) => {
                console.log(`updating smart trade id ${smartTrade.id} to 3commas_logs doc id ${x.id}`)
                const withoutId = JSON.parse(JSON.stringify(smartTrade));
                delete withoutId.id;
                if (x.id) {
                    const update = await adminDb
                    .collection('3commas_logs')
                    .doc(x.id)
                    .update({
                        ...withoutId,
                        already_updated : true
                    })
                    console.log(`update: ${update}, smart trade id ${smartTrade.id} to 3commas_logs doc id ${x.id} is updated`)
                } else {
                    console.log(`NOOOOO smart trade id ${smartTrade.id} to 3commas_logs doc id ${x.id} is not updated`)
                }
               
            }))
        }))
        return Response.json({
            status: true,
            data,
            result
        })
    } catch (error) {
        console.log(error, 'error cron')
        return new Response(JSON.stringify({
            status: false,
            error: error.message,

        }), { status: 500 })
    }
} 