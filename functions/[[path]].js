export async function onRequest(context) {
    const { request, next, env } = context;
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Ignore static assets
    if (path.match(/\.(png|jpg|jpeg|gif|ico|svg|css|js|json|xml|txt|webmanifest|woff|woff2|ttf|eot|otf)$/)) {
        return next();
    }

    let targetHtml = '/'; // Default to zh-Hant (Root)

    // 2. Handle Root Path '/' with Accept-Language Rewrite & IP Geolocation
    if (path === '/') {
        const acceptLanguage = request.headers.get('Accept-Language') || '';
        const userAgent = (request.headers.get('User-Agent') || '').toLowerCase();
        const country = (request.cf?.country || '').toUpperCase();

        // Get the primary language (first one in the list)
        const primaryLang = acceptLanguage.split(',')[0].trim().toLowerCase();

        // Priority 1: Specific Bot Detection
        // Force Traditional Chinese for these platforms
        if (userAgent.includes('discord') || userAgent.includes('bahamut') || userAgent.includes('gamer')) {
            targetHtml = '/';
        }
        // Force Korean for these platforms
        else if (userAgent.includes('arca') || userAgent.includes('kakao') || userAgent.includes('naver')) {
            targetHtml = '/ko-KR';
        }
        // Priority 2: Accept-Language Header (User Preference)
        else if (primaryLang.startsWith('ko')) {
            targetHtml = '/ko-KR';
        } else if (primaryLang.startsWith('ja')) {
            targetHtml = '/ja-JP';
        } else if (primaryLang.startsWith('en')) {
            targetHtml = '/en';
        } else if (primaryLang === 'zh-cn' || primaryLang === 'zh-sg' || primaryLang.startsWith('zh-hans')) {
            targetHtml = '/zh-CN';
        }
        // Priority 3: IP Geolocation Fallback (for bots/users without headers)
        else if (country === 'KR') {
            targetHtml = '/ko-KR';
        } else if (country === 'JP') {
            targetHtml = '/ja-JP';
        } else if (['US', 'GB', 'CA', 'AU', 'NZ', 'IE'].includes(country)) {
            targetHtml = '/en';
        } else if (country === 'CN' || country === 'SG') {
            targetHtml = '/zh-CN';
        }
        // Default (zh-TW/HK or others) -> / which serves index.html
    }
    // 3. Handle Explicit Language Paths (e.g. /en/, /ja-JP/)
    else {
        const pathSegments = path.split('/').filter(p => p);

        if (pathSegments.length > 0) {
            const firstSegment = pathSegments[0].toLowerCase();

            // Check if first segment is a locale
            if (['en', 'ja', 'ja-jp', 'ko', 'ko-kr', 'zh-cn', 'zh-hans'].includes(firstSegment)) {
                // Determine target HTML file based on locale
                if (firstSegment === 'en') targetHtml = '/en';
                else if (firstSegment.startsWith('ja')) targetHtml = '/ja-JP';
                else if (firstSegment.startsWith('ko')) targetHtml = '/ko-KR';
                else if (firstSegment === 'zh-cn' || firstSegment === 'zh-hans') targetHtml = '/zh-CN';
            }
        }
    }

    // 4. Fetch the HTML file
    // We fetch the clean URL (e.g. /en) to avoid 301 redirects from Cloudflare's "Normalize URLs"
    const assetUrl = new URL(targetHtml, url.origin);
    const assetRequest = new Request(assetUrl, request);
    let response = await env.ASSETS.fetch(assetRequest);

    if (!response.ok) {
        // Fallback to root if specific file fails
        const indexUrl = new URL('/', url.origin);
        const indexRequest = new Request(indexUrl, request);
        response = await env.ASSETS.fetch(indexRequest);
    }

    return response;
}
