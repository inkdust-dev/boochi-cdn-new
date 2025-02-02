const fs = require('fs');
const { parse } = require('url');
const path = require('path');

try {
  const whitelist = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'whitelist.json'), 'utf8')).whitelist;

  module.exports = (req, res) => {
    const { pathname } = parse(req.url, true);

    console.log(`Requested path: ${pathname}`);
    console.log(`Whitelist: ${whitelist}`);

    if (whitelist.includes(pathname)) {
      console.log(`Path allowed: ${pathname}`);
      res.writeHead(302, {
        Location: `https://cdn.jsdelivr.net${pathname}`
      });
      res.end();
    } else {
      console.log(`Path forbidden: ${pathname}`);
      res.status(403).send('Forbidden: This path is not allowed.');
    }
  };
} catch (error) {
  console.error('Error reading whitelist:', error);
  res.status(500).send('Internal Server Error');
}
