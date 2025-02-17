import { adminDb } from "@/lib/firebase-admin-config";

export const maxDuration = 25;
export async function POST (request) {
    try {
        const body = await request.json();
        console.log(body, 'this is body')
        const { data } = body;
        console.log(data, 'this is dataaa')
        let result = [];
        if (Array.isArray(data)) {
            result = await Promise.allSettled(
                data?.map(async (x) => {
                    await adminDb.collection('data_feed').add({
                        ...x,
                    })
            }))
        } else {
            result = await Promise.allSettled(
                body?.map(async (x) => {
                    await adminDb.collection('data_feed').add({
                        ...x,
                    })
            }))
        }

        return Response.json({
            status : true,
            message : 'success',
            result : result.map((x) => x.status === 'fulfilled' ? x.value : x.reason),
        });
    } catch (error) {
        return Response.json({ status : false, message : error.message});
    }
}