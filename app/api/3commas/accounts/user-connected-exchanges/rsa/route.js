/* eslint-disable no-undef */
// app/api/accounts/route.js

import generateSignatureRsa from '@/app/utils/generateSignatureRsa';

// const API_KEY = process.env.THREE_COMMAS_RSA_API_KEY;
// const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY; // Use your private key here
const API_KEY = process.env.THREE_COMMAS_API_KEY_BOT_CREATION;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY;



export async function GET() {
  const unix = new Date().getTime();
  console.log("unix =>", unix);
  // const url = `https://api.3commas.io/public/api/ver1/accounts?time=${unix}`;

  try {
    const baseUrl = 'https://api.3commas.io';
    const queryParams = `/public/api/ver1/accounts?time=${unix}`
    const signatureMessage = queryParams;
    const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);


    const response = await fetch(baseUrl + queryParams, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
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
      arr,
      length: data?.length
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