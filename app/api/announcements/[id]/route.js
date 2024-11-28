import { adminDb } from '@/lib/firebase-admin-config';

export async function GET(request, { params }) {
  try {
    const id = (await params).id;

    const doc = await adminDb.collection('announcements').doc(id).get();
    if (!doc.exists) {
      return Response.json({
        status: false,
        message: 'announcement not found',
      });
    }
    return Response.json({ status: true, data: doc.data() });
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 'error',
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
