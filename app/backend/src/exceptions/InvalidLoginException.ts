import HttpException from './HttpException';

class InvalidLoginException extends HttpException {
  private static status = 401;

  constructor(message?:string) {
    super(InvalidLoginException.status, message || 'Invalid email or password');
  }
}

export default InvalidLoginException;
