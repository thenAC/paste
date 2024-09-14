import type { ErrCode } from '../enums/err-code.enum';

export type IApiErrCodeConfig = Record</** err code enum value */ ErrCode, /** msg */ string>;
