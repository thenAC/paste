import { Exception } from 'bwcx-ljsm';

export default class HttpException extends Exception {
  public code: number;

  public constructor(code: number) {
    super(`HttpException with code ${code}`);
    this.name = 'HttpException';
    this.code = code;
  }
}
