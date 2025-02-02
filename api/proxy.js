// functions/proxy.js
export async function handler(req) {
  const { pathname, search } = new URL(req.url);
  const cdnBaseUrl = "https://cdn.jsdelivr.net";

  const allowedPaths = [
    "/gh/jquery/jquery", 
    "/gh/twbs/bootstrap", 
    "/wp/wordpress/wordpress",  
    "/npm/react",
  ];

  const isAllowed = allowedPaths.some((path) => pathname.startsWith(path));

  if (!isAllowed) {
    return new Response("Unauthorized", { status: 403 });
  }

  const proxyUrl = `${cdnBaseUrl}${pathname}${search}`;
  const response = await fetch(proxyUrl, {
    headers: req.headers,
  });

  const responseBody = await response.text();
  return new Response(responseBody, {
    status: response.status,
    headers: response.headers,
  });
}
