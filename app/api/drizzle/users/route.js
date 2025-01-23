import { users } from '@/app/drizzle/schema';
import postgresDb from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email')
    const res = await postgresDb
    .select()
    .from(users)
    .where(eq(users.email, email));

    // const data = await res.json()
    return Response.json({
      status: true,
      data : res
      // result,
      // customersArr,
    });
  } catch (error) {
    return Response.json({ status: false, message: error.message });
  }
}
