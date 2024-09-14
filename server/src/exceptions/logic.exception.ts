import { Exception } from 'bwcx-ljsm';
import type { ErrCode } from '@server/enums/err-code.enum';

export default class LogicException extends Exception {
  public code: ErrCode;

  public constructor(code: ErrCode) {
    super(`Logic err with code ${code}`);
    this.name = 'LogicException';
    this.code = code;
  }
}
