export async function GET() {
  try {

    return Response.json({
      status: 'okelah',
      // res,
    });
  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}
