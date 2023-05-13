import HttpException from './HttpException';

class UnprocessingException extends HttpException {
  private static status = 422;

  constructor(message?:string) {
    super(UnprocessingException.status, message || 'Bad Request');
  }
}

export default UnprocessingException;
