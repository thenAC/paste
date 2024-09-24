import { FromQuery } from 'bwcx-common';
import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { IRelMeta } from '@server/interfaces/rel-meta';

export class GetRelMetaReqDTO {
  /** rel links (comma separated). */
  @FromQuery()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  relLinks: string;
}

export class GetRelMetaRespDTO {
  relMetaList: (IRelMeta | null)[];
}
