import * as bcrypt from 'bcryptjs';
import Auth from '../utils/Auth';
import User from '../database/models/UserModel';
import ValidateLogin from './validations/ValidateLogin';
import InvalidLoginException from '../exceptions/InvalidLoginException';

class LoginService {
  static async login(email:string, password: string): Promise<string> {
    ValidateLogin.validateAllFields(email, password);
    const user = await User.findOne({ where: { email } }) as User;

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new InvalidLoginException('Invalid email or password');
    }

    const { id, username, role } = user;
    const token = Auth.generateToken({
      id,
      username,
      role,
      email,

    });
    return token;
  }
}

export default LoginService;
