import { adminDb } from '@/lib/firebase-admin-config';

export async function GET() {
  try {
    let arr = [];
    const citiesRef = adminDb
      .collection('announcements')
      .orderBy('createdAt', 'desc')
      .limit(10);
    const snapshot = await citiesRef.get();
    snapshot.forEach((doc) => {
     arr.push({id : doc.id, ...doc.data()})
    });
    return new Response(
      JSON.stringify({
        status: 'success',
        data: arr,
      }),
      // { headers: { 'Cache-Control': 's-maxage=10, stale-while-revalidate=59' } } // Add this line
    );
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
