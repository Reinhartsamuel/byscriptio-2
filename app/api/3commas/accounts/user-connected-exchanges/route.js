/* eslint-disable no-undef */
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';
// import CryptoJS from 'crypto-js';

const three_commas_url = process.env.THREE_COMMAS_URL;
const three_commas_api_key = process.env.THREE_COMMAS_API_KEY;
const three_commas_api_secret = process.env.THREE_COMMAS_API_SECRET;

const signature = (secret, url, params) => {
    const message = params ? `${url}?${params}` : url;
    return HmacSHA256(message, secret).toString(Hex)
  }

export async function GET() {
  const queryString = '/ver1/accounts/';
//   const signature = createSignature(three_commas_api_secret, 'https://api.3commas.io/public/api', '/ver1/accounts/');
  const headers = {
    Apikey: three_commas_api_key,
    Signature: signature(three_commas_api_secret, three_commas_url, queryString),
  };
  console.log(headers.Signature);

//   return Response.json({
//     three_commas_url,
//     three_commas_api_key,
//     three_commas_api_secret,
//     signature : headers.Signature
//   });

  try {
    const res = await fetch(three_commas_url + queryString, {
      method: 'GET',
      headers: {
        Signature:signature(three_commas_api_secret, three_commas_url, queryString),
        Apikey: three_commas_api_key,
      },
    });
    const data = await res.json();
    return Response.json({ status: true, data: data });
  } catch (error) {
    return Response.json({
      status: false,
      message: error.message,
    });
  }
}
