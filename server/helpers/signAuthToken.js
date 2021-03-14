const crypto = require('crypto');
const config = require('../../config/config');

const signAuthToken = (content) => {
	const head = Buffer.from(
		JSON.stringify({ alg: 'HS256', typ: 'jwt' })
	).toString('base64');
	const body = Buffer.from(
		JSON.stringify({ ...content, expiresIn: Date.now() + 86400 })
	).toString('base64');
	const signature = crypto
		.createHmac('SHA256', config.jwtSecret)
		.update(`${head}.${body}`)
		.digest('base64');

	return `${head}.${body}.${signature}`;
};

module.exports = signAuthToken;
