import { adminDb } from "@/lib/firebase-admin-config";

export async function GET () {
    try {
        const {data, error, error_attributes, error_description} = await fetch(`https://byscript.io/api/playground/3commas`,{
            method : 'POST',
            body : JSON.stringify({
                "queryParams" : "/v2/smart_trades?per_page=100&page=1&status=all",
                "method" : "GET"
            })
        });
        if (error) {
            console.log(error,error_attributes, error_description)
            return Response.json({
                error,
                error_attributes
            })
        }


        const result = await Promise.all(data?.map(async(smartTrade) => {
            console.log('processing smart trade with id :', smartTrade.id, smartTrade);
            let searchCorrespondingTrade = [];
            const querySnapshot = await adminDb
            .collection('3commas_logs')
            .where('smart_trade_id', '==', String(smartTrade.id))
            .get();
            querySnapshot.forEach((doc) => {
                searchCorrespondingTrade.push({id : doc.id, ...doc.data()})
            });

            await Promise.all(searchCorrespondingTrade?.map(async(x) => {
                console.log(`updating smart trade id ${smartTrade.id} to 3commas_logs doc id ${x.id}`)
                const withoutId = JSON.parse(JSON.stringify(smartTrade));
                delete withoutId.id;
                await adminDb
                .collection('3commas_logs')
                .doc(x.id)
                .update({
                    ...withoutId
                })
            }))
        }))
        return Response.json({
            status : true,
            data,
            result
        })
    } catch (error) {
        console.log(JSON.stringify(error), 'error cron')
        return new Response(JSON.stringify({
            status :false, 
            error : error.message,

        }),{status : 500})
    }
} 