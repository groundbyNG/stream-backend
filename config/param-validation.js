const Joi = require('joi');

module.exports = {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      avatar: Joi.binary(),
    }
  },

  // UPDATE /api/users/:userId
  // updateUser: {
  //   body: {
  //     email: Joi.string().email().required(),
  //     password: Joi.string().required(),
  //     avatar: Joi.binary(),
  //   },
  //   params: {
  //     userId: Joi.string().hex().required()
  //   }
  // },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required()
    }
  }
};
