import generateSignature from '@/app/utils/generateSignature';
import generateSignatureRsa from '@/app/utils/generateSignatureRsa';

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const API_SECRET = process.env.THREE_COMMAS_API_SECRET_BOT_CREATION;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY;


export async function POST(request) {
  try {
    const body = await request.json();
    console.log(body, 'body')
    const url = `https://api.3commas.io/public/api/ver1/bots/${body.bot_id}/delete`;

    // const queryString = "/";
    const signatureMessage = `/public/api/ver1/bots/${body.bot_id}/delete`;
    const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        APIKEY: API_KEY,
        Signature: signature,
      },
      body: JSON.stringify(body),
    });
    // if (!response.ok) {
    //   throw new Error("Network response was not ok");
    // }
    console.log(response);
    const data = await response.json();
    console.log(data,'data')
    if (data?.error)
      return new Response(JSON.stringify({ status: false, ...data }), {
        status: 400,
      });
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
