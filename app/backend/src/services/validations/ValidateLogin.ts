import Joi = require('joi');
import InvalidLoginException from '../../exceptions/InvalidLoginException';

class ValidateLogin {
  private static validateEmail(email:string):void {
    const { error } = Joi.string().email().validate(email);

    if (error) throw new InvalidLoginException('Invalid email or password');
  }

  private static validatePassword(password:string):void {
    const { error } = Joi.string().min(6).validate(password);

    if (error) throw new InvalidLoginException('Invalid email or password');
  }

  static validateAllFields(email:string, password: string):void {
    ValidateLogin.validateEmail(email);
    ValidateLogin.validatePassword(password);
  }
}

export default ValidateLogin;
