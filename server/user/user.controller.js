const User = require('./user.model');
const path = require('path');
const crypto = require('crypto');
const { mkdir, rename } = require('fs').promises;
const signAuthToken = require('../helpers/signAuthToken');
const { USER_DIR, ASSETS } = require('../constants/routes');
const { DAY } = require('../constants/date');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
	User.get(id)
		.then((user) => {
			req.user = user; // eslint-disable-line no-param-reassign
			return next();
		})
		.catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
	return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @returns {User}
 */
async function create(req, res, next) {
	const { password, email, username } = req.body;
	const user = new User({ email, username });

  user.salt = crypto.randomBytes(16).toString('hex');
	// Hashing user's salt and password with 1000 iterations,
	user.hash = crypto
		.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512')
		.toString('hex');

	const avatar = req.files[0];
	const userPath = path.join(global.__basedir, `${USER_DIR}/${user._id}`);
	const tempPath = path.join(
		global.__basedir,
		avatar ? avatar.path : `${ASSETS}/avatar.svg`
	);
	const targetPath = `${userPath}/avatar.${
		avatar ? avatar.mimetype.split('/')[1] || 'jpg' : 'svg'
	}`;
	try {
		await mkdir(userPath, { recursive: true });
		await rename(tempPath, targetPath);
		user.avatar = targetPath;
	} catch (e) {
    // eslint-disable-next-line no-console
		console.log('Error during save avatar ', e);
	}

  user
		.save()
		.then(() => {
      const expiresIn = Date.now() + DAY;
      const token = signAuthToken({ username, _id: user._id }, expiresIn);
      return res.status(200).json({ token, expiresIn });
		})
		.catch(e => next(e));
}

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @returns {User}
 */
function update(req, res, next) {
	const user = req.user;
	user.username = req.body.username;

	user
		.save()
		.then(savedUser => res.json(savedUser))
		.catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
	const { limit = 50, skip = 0 } = req.query;
	User.list({ limit, skip })
		.then(users => res.json(users))
		.catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
	const user = req.user;
	user
		.remove()
		.then(deletedUser => res.json(deletedUser))
		.catch(e => next(e));
}

module.exports = { load, get, create, update, list, remove };
