/* eslint-disable no-undef */
import generateSignatureRsa from '@/app/utils/generateSignatureRsa';

const API_KEY = process.env.THREE_COMMAS_API_KEY_BOT_CREATION;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY;

const url = `https://api.3commas.io/public/api/ver1/bots/create_bot`;

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('this is using RSA key');

    // const queryString = "/";
    const signatureMessage =
      '/public/api/ver1/bots/create_bot' + JSON.stringify(body);
    const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);
    console.log(API_KEY, 'API_KEY');
    console.log(signature, 'signature');

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

    if (data?.error) {
      console.log(data, 'data on error creating bot');
      return new Response(JSON.stringify({ status: false, ...data }), {
        status: 400,
      });
    }
    console.log({
      status: true,
      data,
    }, 'response')
    return Response.json({
      status: true,
      data,
    });
  } catch (error) {
    console.log(error.message);
    return new Response(
      JSON.stringify({ status: false, message: error.message }),
      {
        status: 500,
      }
    );
  }
}
