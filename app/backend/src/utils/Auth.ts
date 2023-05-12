import * as jwt from 'jsonwebtoken';
import { IUserWithoutPassword } from '../database/interfaces/IUser';

class Auth {
  private static secretKey = process.env.JWT_SECRET;
  private static configJwt: jwt.SignOptions = {
    expiresIn: '1m',
    algorithm: 'HS256',
  };

  static generateToken(payload: IUserWithoutPassword): string {
    if (!Auth.secretKey) {
      throw new Error('JWT secret key is not defined');
    }
    const token = jwt.sign(payload, Auth.secretKey, Auth.configJwt);

    return token;
  }
}

export default Auth;
