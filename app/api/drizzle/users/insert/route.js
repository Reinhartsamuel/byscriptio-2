import { users } from "@/app/drizzle/schema";
import postgresDb from "@/lib/db";

export async function POST(request) {
    try {
        const body = await request.json();
        const { user, customerId } = body;
        await postgresDb
        .insert(users)
        .values({
          auth_uid:user.uid || '',
          auth_provider:'google',
          name:user.displayName,
          email:user.email,
          verified:false,
          no_of_logins:user?.numberOfLogin || 0,
          avatar:user?.photoURL || '',
          background_photo:'',
          bio:'',
          external_customer_id :customerId,
        })
        .returning({ id: users.id })
        return Response.json({ ...body });
    } catch (error) {
        return new Response(JSON.stringify(
            { status: 'error', error: error.message }
        )
            , { status: 500 });
    }

}