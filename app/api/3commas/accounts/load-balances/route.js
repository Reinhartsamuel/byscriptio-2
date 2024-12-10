// import generateSignature from '@/app/utils/generateSignature';

// const API_KEY = process.env.THREE_COMMAS_API_KEY_BOT_CREATION;
// const API_SECRET = process.env.THREE_COMMAS_API_SECRET_BOT_CREATION;

// export async function GET(request) {
//   const searchParams = request.nextUrl.searchParams;
//   const accountId = searchParams.get('accountId');
//   const url = `https://api.3commas.io/public/api/ver1/accounts/${accountId}/load_balances`;
//   try {
//     // const queryString = '/';
//     const signatureMessage = `/public/api/ver1/accounts/${accountId}/load_balances`;
//     const signature = generateSignature(API_SECRET, signatureMessage);

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         APIKEY: API_KEY,
//         Signature: signature,
//       },
//     });
//     // if (!response.ok) {
//     //   throw new Error('Network response was not ok');
//     // }
//     const data = await response.json();
//     if (data.error) {
//       return new Response(JSON.stringify({ status: false, ...data }), {
//         status: 400,
//       });
//     }
//     return Response.json({
//       status: true,
//       data,
//     });
//   } catch (error) {
//     return Response.json({
//       status: false,
//       error: error.message,
//     });
//   }
// }
