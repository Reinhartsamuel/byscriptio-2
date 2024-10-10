import CryptoJS from 'crypto-js';
export async function POST(request) {
  try {
    const body = await request.json();
    const searchParams = request.nextUrl.searchParams;
    // const originalString = searchParams.get('text');
    const originalString = body.originalString;

    const encryptedString = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(originalString)
    );

    const base64EncodedString = encryptedString;
    const bytes = CryptoJS.enc.Base64.parse(base64EncodedString);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    const base64DecodedString = JSON.parse(
      Buffer.from(originalString, 'base64').toString('utf8')
    );

    return Response.json({
      originalString,
      encryptedString,
      base64EncodedString,
      base64DecodedString,
      originalText,
    });
  } catch (error) {
    return Response.json({ status: false, message: error.message });
  }
}
