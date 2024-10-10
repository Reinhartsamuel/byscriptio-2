export async function POST(request) {
  try {
    const body = await request.json();
    const action = body.action || 'stop'; // only "start" or "stop"
    const bot_id = body.bot_id || 123;

    const fetchBody = {
      action: action === 'start' ? 'start_bot' : 'stop_bot',
      message_type: 'bot',
      bot_id: bot_id,
      email_token: '52c6860e-5814-47ed-a5ae-663d78446439',
      delay_seconds: 0,
    };

    const result = await fetch(
      'https://app.3commas.io/trade_signal/trading_view',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fetchBody),
      }
    );
    const res = await result.text();
    return Response.json(
      {
        status: 'success',
        data: res,
      },
      { status: res.status || result.status }
    );
  } catch (error) {
    console.log(error.message);
    return Response.json(
      {
        status: 'failed',
        message: error.message,
      },
      { status: 400 }
    );
  }
}
