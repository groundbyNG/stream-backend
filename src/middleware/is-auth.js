import jwt from 'jsonwebtoken';
import SECRET_KEY_JWT from "../constants";

export default ({ req }) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return { isAuth: false };
  }
  const token = authHeader.split(' ');
  if (!token || token === '') {
    return { isAuth: false };
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, SECRET_KEY_JWT);
  } catch (e) {
    return { isAuth: false };
  }
  if(!decodedToken) {
    return { isAuth: false };
  }
  return { isAuth: true, userId: decodedToken.userId };
}