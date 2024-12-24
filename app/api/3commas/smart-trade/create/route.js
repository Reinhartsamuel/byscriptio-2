/* eslint-disable no-undef */

import generateSignatureRsa from '@/app/utils/generateSignatureRsa';

const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const url = `https://api.3commas.io/public/api/v2/smart_trades`;
    const signatureMessage =
      '/public/api/v2/smart_trades' + JSON.stringify(body);
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
    console.log(response);
    const data = await response.json();

    if (data?.error) {
      console.log(data, 'data on error creating bot');
      return new Response(JSON.stringify({ status: false, ...data }), {
        status: 400,
      });
    }
    console.log(
      {
        status: true,
        data,
      },
      'response'
    );
    return Response.json({
      status: true,
      data,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: false, message: error.message }),
      { status: 500 }
    );
  }
}
