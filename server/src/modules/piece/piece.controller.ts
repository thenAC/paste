import { Contract, Data, InjectCtx, Post, RequestContext } from 'bwcx-ljsm';
import { Inject } from 'bwcx-core';
import _ from 'lodash';
import { ApiController } from '@server/decorators';
import { Piece } from '@server/models/piece.model';
import { Statistics } from '@server/models/statistics.model';
import { AddPieceReqDTO, AddPieceRespDTO } from './piece.dto';
import MiscUtils from '@server/utils/misc.util';
import QCloudCosUtils from '@server/utils/qcloud-cos.util';
import { RateLimitIp } from '@server/middlewares/rate-limit.middleware';
import IndexConfig from '@root/common/configs/index.json';

@ApiController()
export default class PieceController {
  public constructor(
    @InjectCtx()
    private readonly ctx: RequestContext,

    @Inject()
    private readonly miscUtils: MiscUtils,

    @Inject()
    private readonly qcloudCosUtils: QCloudCosUtils,
  ) {}

  @Post()
  @Contract(AddPieceReqDTO, AddPieceRespDTO)
  @RateLimitIp(10, 60)
  async addPiece(@Data() data: AddPieceReqDTO): Promise<AddPieceRespDTO> {
    const { code, lang, ttl, rel } = data;
    console.log('[piece.addPiece] Req:', {
      ...data,
      code: `String(${code.length})`,
    });
    let key: string;
    const author = 0; // tourist
    const bytes = code.length;
    const expireAt = ttl > 0 ? new Date(Date.now() + ttl * 1000) : undefined;

    const existedCount = await Piece.countDocuments({});
    let len = 4n;
    while (true) {
      const volume = 62n ** len;
      if (BigInt(existedCount) >= volume / 2n) {
        len++;
      } else {
        break;
      }
    }

    while (true) {
      key = this.miscUtils.randomAlphanumericString(Number(len));
      const existed = await Piece.findOne({ key });
      if (!existed) {
        break;
      }
    }

    const created = await Piece.create([{ key, author, bytes, lang, ttl, rel, expireAt, ip: this.ctx.ip }]);
    console.log('[piece.addPiece] Created:', created[0]._id, key);
    const pieceFileContent = {
      key,
      lang,
      author,
      rel,
      expireAt,
      createdAt: created[0].createdAt,
      code,
    };
    try {
      await this.qcloudCosUtils.uploadFile(`${key}.json`, Buffer.from(JSON.stringify(pieceFileContent), 'utf8'));
    } catch (e) {
      await Piece.deleteOne({ _id: created[0]._id });
      throw e;
    }
    await Statistics.findOneAndUpdate(
      {},
      {
        $inc: { totalCount: 1n, totalBytes: BigInt(bytes) },
      },
      { new: true },
    );

    return {
      key,
      url: `${IndexConfig.siteHost}/s/${key}`,
    };
  }
}
