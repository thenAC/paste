import { FromBody } from 'bwcx-common';
import { IsString, MinLength, MaxLength, IsNotEmpty, IsIn, IsInt, Min } from 'class-validator';
import pieceConfig from '@root/common/configs/piece.json';

export class AddPieceReqDTO {
  @FromBody()
  @IsString()
  @MinLength(1)
  @MaxLength(pieceConfig.maxCodeLength)
  code: string;

  @FromBody()
  @IsString()
  @MinLength(1)
  @MaxLength(16)
  lang: string;

  @FromBody()
  @IsInt()
  @IsIn(pieceConfig.ttlOptions)
  ttl: number;
}

export class AddPieceRespDTO {
  key: string;
}
