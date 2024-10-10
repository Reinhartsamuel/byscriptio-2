import midtransClient from "midtrans-client";

export async function POST(request) {
  
  const body = await request.json()
  // return Response.json({ ...body});
  // Create Snap API instance
  // const serverKey = 'B-Mid-server-49VuoSq7NIlNfHfR4dSqIpQ4'
  const serverKey = process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY_SANDBOX;
  let snap = new midtransClient.Snap({
    // Set to true if you want Production Environment (accept real transaction).
    isProduction: false,
    serverKey: serverKey
  });

  let parameter = {
    transaction_details: {
      order_id: body?.orderId,
      gross_amount: body?.amount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      first_name: body?.first_name,
      last_name: body?.last_name,
      email: body?.email,
      phone: body?.phone,
    },
  };

  try {
      const trx = await snap.createTransaction(parameter);
      try {
        await fetch({
          url : 'https://autotrade-tau.vercel.app/api/email',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type : 'order',
            email : body?.email,
            name : body?.first_name + ' ' + body?.last_name
          })
        })
      } catch (error) {
        console.log(error.message, 'error sending email create order');
        // return Response.json({status : false, message : error.message, data : "Error sending email create order", body})
      }
      return Response.json({ data: {...trx}, body });
  } catch (error) {
    return Response.json({status : false, message : error.message, data : "Error creating snap payment", body, parameter,serverKey})
  }



}