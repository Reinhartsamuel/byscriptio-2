import { MARKET_TYPES, PAIRS } from "../constants/market_type";
import generateSignatureRsa from "./generateSignatureRsa";
import { getExchangeData } from "./getExchangeData";


const API_KEY = process.env.THREE_COMMAS_API_KEY_CREATE_SMART_TRADE;
const PRIVATE_KEY = process.env.THREE_COMMAS_RSA_PRIVATE_KEY_SMART_TRADE;
const baseUrl = 'https://api.3commas.io';


export async function getMultiplier(coin, autotrader) {
    console.log('calling getMultiplier')
    const { market_code } = await getExchangeData(autotrader);
    const market = market_code ? MARKET_TYPES?.find((x) => x.code === market_code) : MARKET_TYPES.find((x) =>
        x.code?.includes(autotrader?.exchange_name?.toLowerCase()) &&
        (x.code?.includes('futures') || x.code?.includes('perpetual'))
    );
    console.log(market, 'market anjeeeng');
    if (market_code === null) {
        return 1;
    }

    const searchPairName = 
    market_code === 'bybit_usdt_perpetual' ? 'USDT_VETUSDT' :
    market_code === 'bybit_spot' ? 'USDT_VET' :
    market_code === 'binance' ? 'USDT_VET' :
    market_code === 'gate_io_usdt_perpetual' ? 'USDT_VET_USDT' :
    market_code === 'binance_tr' ? 'USDT_VET' :
    market_code === 'okex_futures' ? 'VET_VET-USD-SWAP' :
    market_code === 'huobi' ? 'USDT_VET' :
    market_code === 'okex' ? 'USDT_VET' :
    market_code === 'gate_io' ? 'USDT_VET' :
    market_code === 'binance_futures' ? 'USDT_VETUSDT' :
    market_code === 'bybit' ? 'VET_VETUSD' :
    market_code === 'binance_us' ? 'USDT_VET' :
    market_code === 'bitfinex' ? 'USDT_VET' :
    market_code === 'kucoin' ? 'USDT_VET' :
    market_code === 'bitstamp' ? 'USD_VET' :
    market_code === 'bybit_usdt_perpetual' ? 'USDT_VETUSDT' :
    '';

    // const searchPairName = PAIRS.find((x) => x.market_code === market_code)?.pairs?.find((x) => x.includes(coin));
    console.log(searchPairName, 'searchPairName anjeeeng');
    if (searchPairName === undefined) {
        return 1;
    }

    const totalParams = '/public/api' + `/ver1/accounts/currency_rates_with_leverage_data?market_code=${market.code}&pair=${searchPairName}`;
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
    console.log(data, 'this is data to find quanto multiplier anjeeeng');

    return data?.quanto_multiplier ? parseFloat(data?.quanto_multiplier) : 1;

    // amount = contract
    // position = usdt
}