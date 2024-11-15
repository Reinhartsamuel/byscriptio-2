import { users } from '@/app/drizzle/schema';
import postgresDb from '@/lib/db';

export async function GET(request) {
  try {
    const result = await postgresDb.select().from(users);
    return Response.json({ status: true, data: { users: result } });
  } catch (error) {
    return Response.json({ status: false, message: error.message });
  }
}