/* eslint-disable no-undef */
export async function GET(request) {
    try {
        const params = request.nextUrl.searchParams;
        const ticker = params.get('ticker');
        if (!ticker) return new Response('Please include ticker, ticker is undefined!', { status: 400 });
        const fetchList = await fetch('https://api.coingecko.com/api/v3/coins/list', {
            headers: {
                accept: 'application/json',
                'x-cg-api-key': process.env.COINGECKO_API_KEY
            }
        });
        const fetchListResult = await fetchList.json();
        if (
            !Array.isArray(fetchListResult) ||
            fetchListResult.length === 0
        ) return new Response(JSON.stringify({
            message : 'No coins found', 
            ...fetchListResult?.status
        }), { status: 400 });
        console.log(fetchListResult, 'fetchListResult')

        const obj = fetchListResult?.find((coin) => coin.symbol === ticker.toLowerCase());
        const id = obj.id;
        const fetchCoin = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`, {
            headers: {
                accept: 'application/json',
                'x-cg-api-key': process.env.COINGECKO_API_KEY
            }
        });
        const result = await fetchCoin.json();
        return Response.json({
            message: 'success',
            ...result,
            thumbnail : result?.image?.small
        })
    } catch (error) {
        return new Response(JSON.stringify({
            message : 'error',
            error : error.message
        }), {status : 500})
    }
}