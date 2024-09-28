import { FromQuery } from 'bwcx-common';
import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
import { IRelMeta } from '@server/interfaces/rel-meta';

export class GetRelMetaReqDTO {
  /** rel links (comma separated). */
  @FromQuery()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(2048)
  relLinks: string;
}

export class GetRelMetaRespDTO {
  relMetaList: (IRelMeta | null)[];
}
