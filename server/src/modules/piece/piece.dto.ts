import { FromBody, FromQuery } from 'bwcx-common';
import { IsString, MinLength, MaxLength, IsIn, IsInt, IsOptional, IsUrl, IsArray, IsNotEmpty } from 'class-validator';
import pieceConfig from '@root/common/configs/piece.json';
import { IRelMeta } from '@server/interfaces/rel-meta';

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

  @FromBody()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUrl({ each: true })
  relLinks?: string[];
}

export class AddPieceRespDTO {
  key: string;
  url: string;
}

export class GetPieceRelMetaReqDTO {
  /** rel links (comma separated). */
  @FromQuery()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  relLinks: string;
}

export class GetPieceRelMetaRespDTO {
  relMetaList: (IRelMeta | null)[];
}
