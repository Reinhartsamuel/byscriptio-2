export async function POST(request) {
    try {
        const body = await request.json();
        const { customer, price, subscriptionId, productName } = body;
        const postData = {
            "price_amount": price,
            "price_currency": "idr",
            "order_id": subscriptionId,
            "order_description": `${customer?.name} - ${customer?.email} - ${productName}`,
            "ipn_callback_url": "https://www.byscript.io/api/callback",
            "success_url": `https://byscript.io/${customer?.name}`,
            "cancel_url": `https://byscript.io/${customer?.name}`,
            "partially_paid_url": "https://nowpayments.io",
            "is_fixed_rate": true,
            "is_fee_paid_by_user": false
        };
        console.log('postData', postData);
        const r = await fetch('https://api.nowpayments.io/v1/invoice', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.NOWPAYMENTS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });
        const paymentResponse = await r.json();
        if (r.status !== 200) {
            console.log(paymentResponse, 'masuk sini;::',)
            throw new Error(paymentResponse.message);
        }
        return new Response(JSON.stringify({
            status: true,
            data: paymentResponse
        }), {
            status: 201
        })
    } catch (error) {
        console.log(error.message, ':::::error creating invoice');
        return new Response(JSON.stringify({
            status: false,
            message: error.message,
            error: 'internal server error!'
        }), {
            status: 500
        })
    }
}