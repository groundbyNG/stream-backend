const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const User = require('../user/user.model');
const signAuthToken = require('../helpers/signAuthToken');
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
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  const { username, password } = req.body;

  User.findOne({ username }, (err, user) => {
    if (user === null) {
      return res.status(400).send({
        message: 'User not found.',
      });
    }
    if (user.validPassword(password)) {
      const token = signAuthToken({ username });
      return res.status(200).json({ token });
    }
    return res.status(400).send({
      message: 'Wrong Password',
    });
  });

  const err = new APIError(
    'Authentication error',
    httpStatus.UNAUTHORIZED,
    true
  );
  return next(err);
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
