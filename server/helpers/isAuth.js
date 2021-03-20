const crypto = require('crypto');
const config = require('../../config/config');
const querystring = require('querystring');


const isAuth = (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : querystring.parse(req.url.split('?')[1]).access_token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6Imp3dCJ9.eyJ1c2VybmFtZSI6InF3ZSIsImV4cGlyZXNJbiI6MTYxNTgyNDEwNDM3Nn0=.uU2v11zXBuufhQaYuLhVukd8Uvzhu7qQf54FMkFIQwc=';
  if (token) {
    const tokenParts = token
      .split('.');
    const signature = crypto
      .createHmac('SHA256', config.jwtSecret)
      .update(`${tokenParts[0]}.${tokenParts[1]}`)
      .digest('base64');

    if (signature === tokenParts[2]) {
      next(JSON.parse(
        Buffer.from(tokenParts[1], 'base64').toString(
          'utf8'
        )
      ));
    } else {
      res.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      res.destroy();
      return;
    }
  }
  res.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
  res.destroy();
  return;
};

module.exports = isAuth;
