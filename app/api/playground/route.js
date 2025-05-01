import { MARKET_TYPES, PAIRS } from "@/app/constants/market_type";
import { closePreviousTrade } from "@/app/utils/closePreviousTrade";
import { executeNewTrade } from "@/app/utils/executeNewTrade";
import generateSignatureRsa from "@/app/utils/generateSignatureRsa";
import { pairNameFor3commas } from "@/app/utils/pairNameFor3commas";
import { adminDb } from "@/lib/firebase-admin-config";


const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';


async function getMultiplier(coin, autotrader) {
  const market = MARKET_TYPES.find((x) =>
    x.code?.includes(autotrader?.exchange_name?.toLowerCase()) &&
    (x.code?.includes('futures') || x.code?.includes('perpetual'))
  );
  console.log(market, 'market anjeeeng');

  const ngentot = PAIRS.find((x) => x.market_code === 'gate_io_usdt_perpetual').pairs?.find((x) => x.includes(coin));
  console.log(ngentot, 'ngentot anjeeeng');
  const pairName = ''
  console.log(pairName, 'pairName kudaaa');

  if (pairName === undefined) {
    return 1000000000000000;
  }

  const totalParams = '/public/api' + `/ver1/accounts/currency_rates_with_leverage_data?market_code=${market.code}&pair=${pairName}`;
  const finalUrl = baseUrl + totalParams;
  const signature = generateSignatureRsa(PRIVATE_KEY, totalParams);
  const response = await fetch(finalUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      APIKEY: API_KEY,
      Signature: signature,
    }
  });
  const data = await response.json();
  console.log(data, ' this is data to find quanto multiplier anjeeeng');

  return data?.quanto_multiplier ? parseFloat(data?.quanto_multiplier) : 1;

  // amount = contract
  // position = usdt
}


export async function POST(request) {
  try {
    const body = await request.json();
    const doc = await adminDb
      .collection('dca_bots')
      .doc('1AXLvRYSPFhE3jPz7G3i')
      .get();
    const autotrader = { ...doc.data(), id: doc.id };


    const multiplier = await getMultiplier(body.pair?.split('_')[1], autotrader);
    return Response.json({
      multiplier,
      status: 'okelah',
    })


    const bodySend = {
      account_id: autotrader?.exchange_external_id ? autotrader.exchange_external_id : 'no account id',
      // pair: body.pair,
      pair: await pairNameFor3commas(autotrader, body.pair),
      instant: false,
      position: {
        type: body.type,
        units: {
          // value: String(parseFloat(autotrader.tradeAmount) / parseFloat(body.price)) // amount in token, not in usd, so (amountUsd/price)
          value: parseFloat(autotrader.tradeAmount) / (10000 * parseFloat(body.price))
          // value :  parseFloat(autotrader.tradeAmount)  / (contractMuliplier * parseFloat(body.price))
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
    if (!autotrader?.exchange_external_id) {
      bodySend.autotrader_id = autotrader?.id;
    }

    // 2. find latest trade history on 3commas_logs where same trading_plan_id and pair
    const responseCloseMarket = await closePreviousTrade({
      body,
      bodySend,
      autotrader,
      webhookId: `testing-${new Date().getTime()}`,
    });

    // 4. execute smart trade
    // console.log(`Executing smart trade for ${autotrader.id}`)
    const responseExecute = await executeNewTrade({
      body,
      bodySend,
      nonce: 1,
      updateTradeAmount: responseCloseMarket?.updateTradeAmount,
      autotrader,
      webhookId: `testing-${new Date().getTime()}`,
    })


    const returnValue = {
      //   ...autotrader,
      // latestTradeHistory,
      responseExecute,
      responseCloseMarket,
    }
    return Response.json({
      status: 'okelah',
      ...returnValue
    })
  } catch (error) {
    return Response.json({
      error: error.message,
      status: false,
    });
  }
}