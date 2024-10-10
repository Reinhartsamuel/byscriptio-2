import { adminDb } from "../../../lib/firebase-admin-config";

export async function POST (request) {
    try {
        const body = await request.json();
        const res = await adminDb.collection('webhooks').add({
            ...body,
            createdAt : new Date(),
            type: 'signal'
        });
        console.log('added signal ' + JSON.stringify(body));
        return Response.json({
            status : true,
            mesage: 'Signal added successfully',
            id : res?.id
        })
    } catch (error) {
        console.error('error sending signal with error ::::',error.message)
        return Response.json({
            status : false,
            message : error.message,
            error
        })
    }
}