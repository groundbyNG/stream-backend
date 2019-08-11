import User from '../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import SECRET_KEY_JWT from "../../constants";

const resolvers = {
  Query: {
    hello: () => {
      return 'hello';
    },
    login: async (root, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User doesnt exist")
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Password is incorrect");
      }
      const token = jwt.sign({ userId: user.id, email: user.email}, SECRET_KEY_JWT, {
        expiresIn: '1h'
      });
      return {
        userId: user.id,
        token,
        tokenExpiration: 1
      }
    }
  },
  Mutation: {
    createUser: async (root, { email, password }) => {
      try {
        const existUser = await User.findOne({email});
        if (existUser) {
          throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
          email,
          password: hashedPassword
        });

        const result = await user.save();
        return {...result._doc, _id: result.id};
      } catch (e) {
        throw new Error(e);
      }
    }
  }
};
export default resolvers;