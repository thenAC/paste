import { FromBody } from 'bwcx-common';
import { IsString, MinLength, MaxLength, IsIn, IsInt, IsOptional, IsUrl } from 'class-validator';
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
  @IsIn(pieceConfig.ttlOptions.map((ttl) => ttl.value))
  ttl: number;

  @FromBody()
  @IsOptional()
  @IsString()
  @IsUrl()
  rel?: string;
}

export class AddPieceRespDTO {
  key: string;
  url: string;
}
