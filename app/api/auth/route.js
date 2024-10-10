import * as admin from 'firebase-admin';
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  const authToken = searchParams.get('token');

  try {
    const uid = await admin.auth().verifyIdToken(authToken);
    return Response.json({ status : true, ganteng:authToken, uid:uid});
  } catch (error) {
    return Response.json({status :false, error:error.message})
  }
  


  return Response.json({ status : true,uid });
}
