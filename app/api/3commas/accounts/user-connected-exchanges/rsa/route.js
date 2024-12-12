// app/api/accounts/route.js

import generateSignatureRsa from '@/app/utils/generateSignatureRsa';

// const API_KEY = process.env.THREE_COMMAS_RSA_API_KEY;
// const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY; // Use your private key here
const API_KEY = process.env.THREE_COMMAS_API_KEY_BOT_CREATION;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY;



const url = `https://api.3commas.io/public/api/ver1/accounts`;

export async function GET() {
  try {
    const signatureMessage = '/public/api/ver1/accounts';
    const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        APIKEY: API_KEY,
        Signature: signature,
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const arr = Array.isArray(data) ? data.map((x) => ({
      name: x.name,
      id: x.id,
    })) : null;

    return new Response(JSON.stringify({
      status: true,
      data,
      arr
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: false, message: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}