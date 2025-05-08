export async function pairNameFor3commas(bot, _pair) {
    if (bot?.marketType === 'spot') return _pair;
    const exchange = bot?.exchange_name?.toLowerCase();
    if (exchange === 'binance') {
        // check whether it's coinM or USDT
        const payload = {
            "queryParams" : `/ver1/accounts/${bot.exchange_external_id}`,
            "method" : "GET"
        }
        
        const x = await fetch('https://byscript.io/api/playground/3commas', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const res = await x.json();
        if (res.data?.exchange_name === 'Binance Futures USDT-M') {
            return `${_pair}USDT`;
        } else if (res.data?.exchange_name === 'Binance Futures COIN-M') {
            return `${_pair}USD_PERP`;
        } else {
            return _pair;
        }
    }
    if (exchange === 'bybit') return `${_pair}USDT`;
    if (exchange === 'bitget') return `${_pair}USDT_UMCBL`;
    if (exchange === 'gate') return `${_pair}_USDT`;
    if (exchange === 'okx') return `${_pair}-USDT-SWAP`;
    return _pair;
}