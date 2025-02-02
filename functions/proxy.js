// functions/proxy.js

// 白名单仓库、插件和包
const allowedRepos = [
  "gh/jquery/jquery",
  "gh/twbs/bootstrap",
  "gh/vuejs/vue",
  "wp/wordpress/wordpress",
  "npm/react",
  "npm/vue",
];

export async function handler(req) {
  // 获取请求的 URL 信息
  const { pathname, search } = new URL(req.url);

  // 定义加速的 jsDelivr 域名
  const cdnBaseUrl = "https://cdn.jsdelivr.net";

  // 检查请求路径是否在需要代理的目录下，并且是否在白名单中
  const isValidPath =
    (pathname.startsWith("/gh") || pathname.startsWith("/wp") || pathname.startsWith("/npm")) &&
    allowedRepos.some((repo) => pathname.startsWith("/" + repo));

  if (!isValidPath) {
    return new Response("Unauthorized", { status: 403 });
  }

  // 代理请求到加速域名
  const proxyUrl = `${cdnBaseUrl}${pathname}${search}`;

  // 发送请求到加速域名
  const response = await fetch(proxyUrl, {
    headers: req.headers, // 保持请求头一致
  });

  // 返回 jsDelivr 的响应
  const responseBody = await response.text();
  return new Response(responseBody, {
    status: response.status,
    headers: response.headers,
  });
}
