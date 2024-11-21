import CryptoJS from 'crypto-js';
const API_KEY = '';
const API_SECRET = '';

const url = `https://api.3commas.io/public/api/ver1/bots/create_bot`;

function generateSignature(secret, message) {
  return CryptoJS.HmacSHA256(message, secret).toString(CryptoJS.enc.Hex);
}

export async function GET() {
  try {
    const queryString = '/';
    const signatureMessage = '/public/api/ver1/bots/create_bot' + queryString;
    const signature = generateSignature(API_SECRET, signatureMessage);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        APIKEY: API_KEY,
        Signature: signature,
      },
      body : JSON.stringify({
        name: 'testing create bot reinhart',
        account_id : 32759252,
        pairs : '',
        base_order_volume : 100,
        take_profit : 10,
        safety_order_volume : 1,
        martingale_volume_coefficient : 1,
        martingale_step_coefficient :1, 
        max_safety_orders : 12,
        active_safety_orders_count : 1,
        safety_order_step_percentage : 2, 
        take_profit_type : 'total',
        strategy_list : []
      })
    });
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    console.log(response);
    const data = await response.json();
    return Response.json({
      status: true,
      data,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: false, message: error.message }),
      {
        status: 500,
      }
    );
  }
}
