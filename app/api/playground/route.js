import { adminDb } from '@/lib/firebase-admin-config';

export async function POST(request) {
  try {
    const body = await request.json();
    let autotraders = [];
    const querySnapshot = await adminDb
      .collection('dca_bots')
      .where('trading_plan_pair', 'array-contains', body.trading_plan_id + '_' + body.pair)
      .where('status', '==', 'ACTIVE')
      .where('smart_trade', '==', true)
      .get();

    if (querySnapshot.empty) {
      // console.log(
      //     `no bots found lookup under ${tp_unique_id} timestamp : `,
      //     new Date().getTime()
      // );
      return Response.json({ status: false, message: 'No bots foundd' });
    }
    querySnapshot.forEach((doc) => {
      autotraders.push({ ...doc.data(), id: doc.id });
    })


    const autotrader = autotraders[0];
    const bodySend = {
      account_id: autotrader.exchange_external_id,
      pair: body.pair,
      instant: false,
      position: {
          type: body.type,
          units: {
              value: String(parseFloat(autotrader.tradeAmount) / parseFloat(body.price))
          },
          order_type: "market"
      },
      leverage: {
          enabled: true,
          type: "isolated",
          value: "1"
      },
      take_profit: {
          enabled: false,
      },
      stop_loss: {
          enabled: false,
      },
  }

    return Response.json({
      status: 'okelah',
      autotraders,
      length: autotraders.length,
      bodySend
    });
  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}
