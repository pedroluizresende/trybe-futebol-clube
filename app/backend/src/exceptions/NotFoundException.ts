import HttpException from './HttpException';

class NotFoundException extends HttpException {
  private static status = 404;

  constructor(message?: string) {
    super(NotFoundException.status, message || 'NotFound');
  }
}

export default NotFoundException;
