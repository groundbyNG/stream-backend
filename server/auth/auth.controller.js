const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const User = require('../user/user.model');
const signAuthToken = require('../helpers/signAuthToken');
const { DAY } = require('../constants/date');
// const config = require('../../config/config');
// const jwt = require('jsonwebtoken');

// sample user, used for authentication
// const user = {
//   username: 'react',
//   password: 'express'
// };

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
async function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).exec();
    if (user === null) {
      return res.status(400).send({
        message: 'User not found.',
      });
    }
    if (user.validPassword(password, user.salt, user.hash)) {
      const expiresIn = Date.now() + DAY;
      const token = signAuthToken({ username, _id: user._id }, expiresIn);
      return res.status(200).json({ token, expiresIn });
    }
    return res.status(400).send({
      message: 'Wrong Password',
    });
  } catch (err) {
    return next(new APIError(
      `Authentication error: ${err}`,
      httpStatus.UNAUTHORIZED,
      true
    ));
  }
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100,
  });
}

module.exports = { login, getRandomNumber };
