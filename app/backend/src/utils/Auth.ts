import * as jwt from 'jsonwebtoken';
import { IUserWithoutPassword } from '../database/interfaces/IUser';
import User from '../database/models/UserModel';

class Auth {
  private static secretKey = process.env.JWT_SECRET;
  private static configJwt: jwt.SignOptions = {
    expiresIn: '1d',
    algorithm: 'HS256',
  };

  static generateToken(payload: IUserWithoutPassword): string {
    if (!Auth.secretKey) {
      throw new Error('JWT secret key is not defined');
    }
    const token = jwt.sign(payload, Auth.secretKey, Auth.configJwt);

    return token;
  }

  static validateToken(token:string) {
    if (Auth.secretKey) {
      const isValid:string | jwt.JwtPayload | User = jwt.verify(token, Auth.secretKey) as User;
      const user = {
        id: isValid.id,
        username: isValid.username,
        role: isValid.role,
        email: isValid.email,
      };

      return user;
    }
  }
}

export default Auth;
