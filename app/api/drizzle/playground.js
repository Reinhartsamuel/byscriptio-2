export async function GET () {
    try {
        return Response.json({
            status  : true
        })
    } catch (error) {
        return new Response(JSON.stringify({ status: false, message: error.message }), { status: 500 })
    }
}