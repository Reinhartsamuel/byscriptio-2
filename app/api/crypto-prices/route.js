/* eslint-disable no-undef */
import { admin, adminDb } from "@/lib/firebase-admin-config";
import { headers } from "next/headers";

export const maxDuration = 60; // This function can run for a maximum of 60 seconds 
export async function GET(request) {
    try {
        const headersList = headers();
        const searchParams = request.nextUrl.searchParams;
        const pair = searchParams.get('pair');
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit'), 10) : 10; // Default limit is 10
        const Authorization = headersList.get('Authorization');
        
        if (Authorization !== process.env.BREVO_API_KEY) {
            return new Response(JSON.stringify({
                status: 'error',
                message: 'Not Authorized, check your authorization header',
                statusCode: 401
            }), {
                status: 401
            });
        }

        if ((dateFrom && !dateTo) || (!dateFrom && dateTo)) {
            return new Response(JSON.stringify({
                status: 'error',
                message: 'Both dateFrom and dateTo must be provided for date filtering',
                statusCode: 400
            }), {
                status: 400
            });
        }

        const dbRef = adminDb.collection('data_feed');
        let query = dbRef;

        if (pair) {
            query = query.where('pair', '==', pair);
        }

        if (dateFrom && dateTo) {
            // Assuming dateFrom and dateTo are Unix timestamps
            const dateFromTimestamp = admin.firestore.Timestamp.fromMillis(dateFrom * 1000);
            const dateToTimestamp = admin.firestore.Timestamp.fromMillis(dateTo * 1000);
        
            query = query.where('createdAt', '>=', dateFromTimestamp);
            query = query.where('createdAt', '<=', dateToTimestamp);
        }

        query = query.limit(limit);

        const snapshot = await query.get();
        const arr = [];

        snapshot.forEach((doc) => {
            arr.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return new Response(JSON.stringify({
            status: true,
            data: arr
        }));
    } catch (error) {
        return new Response(JSON.stringify({
            status: 'error',
            message: error.message,
            statusCode: error.status || error.statusCode
        }), {
            status: 500
        });
    }
}
