/* eslint-disable no-undef */
// import { threeCommas } from '@/lib/3commas';
import threeCommasAPI from '3commas-api-node';
import CryptoJS from 'crypto-js';

function generateHmacSha256(key, message) {
  // Create the HMAC SHA256 hash
  const hash = CryptoJS.HmacSHA256(message, key);
  
  // Convert the hash to a hexadecimal string
  return hash.toString(CryptoJS.enc.Hex);
}


export async function GET() {
  try {
    const res = await fetch(
      process.env.THREE_COMMAS_URL,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Apikey': process.env.THREE_COMMAS_API_KEY,
          'x-api-secret': process.env.THREE_COMMAS_API_SECRET
        },
      }
    )
    return Response.json({ status: true, data });
  } catch (error) {
    return Response.json({
      status: false,
      message: error.message,
    });
  }
}
