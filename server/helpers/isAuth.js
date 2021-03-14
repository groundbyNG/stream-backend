const crypto = require('crypto');
const config = require('../../config/config');

const isAuth = (req, res, next) => {
  if (req.headers.authorization) {
    const tokenParts = req.headers.authorization
      .split(' ')[1]
      .split('.');
    const signature = crypto
      .createHmac('SHA256', config.jwtSecret)
      .update(`${tokenParts[0]}.${tokenParts[1]}`)
      .digest('base64');

    if (signature === tokenParts[2]) {
      // eslint-disable-next-line no-console
      console.log('signature', JSON.parse(
        Buffer.from(tokenParts[1], 'base64').toString(
          'utf8'
        )
      ));
    }
    next();
  }
  next();
};

module.exports = isAuth;
