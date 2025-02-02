const fs = require('fs');
const { parse } = require('url');

const path = require('path');
const whitelist = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'whitelist.json'), 'utf8')).whitelist;

module.exports = (req, res) => {
  const { query, pathname } = parse(req.url, true);
  const requestPath = pathname.substring(1); // 移除开头的斜杠

  // 检查请求路径是否在白名单中
  if (whitelist.includes(`allowed-path/${requestPath}`)) {
    res.writeHead(302, {
      Location: `https://cdn.jsdelivr.net/allowed-path/${requestPath}`
    });
    res.end();
  } else {
    res.status(403).send('Forbidden: This path is not allowed.');
  }
};
