export default async function trackIp(req) {
    try {
        const ip =
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('x-real-ip') || // Common in Nginx setups
            req.headers.get('cf-connecting-ip') || // Cloudflare
            req.headers.get('true-client-ip') || // Akamai
            req.headers.get('x-client-ip') || // Generic
            req.headers.get('fastly-client-ip') || // Fastly
            req.headers.get('x-cluster-client-ip') || // Some proxies
            req.headers.get('forwarded') || // RFC 7239 standard
            req.ip ||
            'Unknown IP';
        console.log('request ip:::', ip);
        return ip;
    } catch (error) {
        console.log('error logging ip :::', error.message);
    }
}