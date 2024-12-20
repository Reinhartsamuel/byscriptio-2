import generateSignature from '@/app/utils/generateSignature';

const API_KEY = process.env.THREE_COMMAS_API_KEY_BOT_CREATION;
const API_SECRET = process.env.THREE_COMMAS_API_SECRET_BOT_CREATION;


const url = `https://api.3commas.io/public/api/ver1/accounts/`;


export async function GET() {
  try {
    // const queryString = '/';
    const signatureMessage = '/public/api/ver1/accounts';
    const signature = generateSignature(API_SECRET, signatureMessage);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        APIKEY: API_KEY,
        Signature: signature,
      }
    });
    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }
    console.log(response);
    const data = await response.json();
    const arr = Array.isArray(data) ? data.map((x ) => ({
      name: x.name,
      id: x.id,})) : null
    return Response.json({
      status: true,
      data,
      arr
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
