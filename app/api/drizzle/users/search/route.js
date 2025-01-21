import { users } from "@/app/drizzle/schema";
import postgresDb from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const s = searchParams.get('s');

    // Transform the search term into a valid tsquery string
    const tsqueryString = s ? s.split(' ').join(' & ') : '';

    const result = await postgresDb
      .select()
      .from(users)
      .where(
        sql`to_tsvector('english', ${users.name}) @@ to_tsquery('english', ${tsqueryString})`
      );

    return new Response(
      JSON.stringify({
        status: true,
        s,
        result,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ status: false, message: error.message }),
      { status: 500 }
    );
  }
}
