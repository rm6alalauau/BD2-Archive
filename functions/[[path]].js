export async function onRequest(context) {
    const { request, next, env } = context;
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. Ignore static assets
    if (path.match(/\.(png|jpg|jpeg|gif|ico|svg|css|js|json|xml|txt|webmanifest)$/)) {
        return next();
    }

    let targetHtml = '/index.html'; // Default to zh-Hant

    // 2. Handle Root Path '/' with Accept-Language Rewrite
    if (path === '/') {
        const acceptLanguage = request.headers.get('Accept-Language') || '';
        // Get the primary language (first one in the list)
        const primaryLang = acceptLanguage.split(',')[0].trim().toLowerCase();

        if (primaryLang.startsWith('ko')) {
            targetHtml = '/ko-KR.html';
        } else if (primaryLang.startsWith('ja')) {
            targetHtml = '/ja-JP.html';
        } else if (primaryLang.startsWith('en')) {
            targetHtml = '/en.html';
        } else if (primaryLang === 'zh-cn' || primaryLang === 'zh-sg' || primaryLang.startsWith('zh-hans')) {
            targetHtml = '/zh-CN.html';
        }
        // Default (zh-TW/HK or others) -> index.html
    }
    // 3. Handle Explicit Language Paths (e.g. /en/, /ja-JP/)
    else {
        const pathSegments = path.split('/').filter(p => p);

        if (pathSegments.length > 0) {
            const firstSegment = pathSegments[0].toLowerCase();

            // Check if first segment is a locale
            if (['en', 'ja', 'ja-jp', 'ko', 'ko-kr', 'zh-cn', 'zh-hans'].includes(firstSegment)) {
                // Determine target HTML file based on locale
                if (firstSegment === 'en') targetHtml = '/en.html';
                else if (firstSegment.startsWith('ja')) targetHtml = '/ja-JP.html';
                else if (firstSegment.startsWith('ko')) targetHtml = '/ko-KR.html';
                else if (firstSegment === 'zh-cn' || firstSegment === 'zh-hans') targetHtml = '/zh-CN.html';
            }
        }
    }

    // 4. Fetch the HTML file
    // We fetch the specific HTML file which already contains the correct metadata.
    const assetUrl = new URL(targetHtml, url.origin);
    const assetRequest = new Request(assetUrl, request);
    let response = await env.ASSETS.fetch(assetRequest);

    if (!response.ok) {
        // Fallback to index.html if specific file fails
        const indexUrl = new URL('/index.html', url.origin);
        const indexRequest = new Request(indexUrl, request);
        response = await env.ASSETS.fetch(indexRequest);
    }

    return response;
}
