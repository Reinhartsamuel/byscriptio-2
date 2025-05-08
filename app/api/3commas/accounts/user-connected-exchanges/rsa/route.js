/* eslint-disable no-undef */
// app/api/accounts/route.js

import generateSignatureRsa from '@/app/utils/generateSignatureRsa';

// const API_KEY = process.env.THREE_COMMAS_RSA_API_KEY;
// const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY; // Use your private key here
const API_KEY = process.env.THREE_COMMAS_API_KEY_BOT_CREATION;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY;

export const maxDuration = 300; // This function can run for a maximum of 300 seconds


export async function GET(request) {
  try {
    const { signal } = new AbortController()
    const unix = new Date().getTime();

    const searchParams = request?.nextUrl?.searchParams;
    const per_page = searchParams?.get('per_page');
    const page = searchParams?.get('page');
    const baseUrl = 'https://api.3commas.io';
    let queryParams = `/public/api/ver1/accounts?time=${unix}`


    if (per_page && page) {
      queryParams += `&per_page=${per_page}&page=${page}`
    }



    const signatureMessage = queryParams;
    const signature = generateSignatureRsa(PRIVATE_KEY, signatureMessage);


    const response = await fetch(baseUrl + queryParams, {
      method: 'GET',
      signal,
      next: { revalidate: 0 },
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        APIKEY: API_KEY,
        Signature: signature,
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const arr = Array.isArray(data) ? data.map((x) => ({
      name: x.name,
      id: x.id,
    })) : null;

    const headers = new Headers({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });

    return new Response(JSON.stringify({
      status: true,
      data,
      arr,
      length: data?.length
    }), {
      status: 200,
      headers,
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