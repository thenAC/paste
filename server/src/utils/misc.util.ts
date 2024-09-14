import type { RequestContext } from 'bwcx-ljsm';
import { Provide } from 'bwcx-core';
import cryptoRandomString from 'crypto-random-string';

@Provide()
export default class MiscUtils {
  public getIp(ctx: RequestContext): string {
    const ssrIp = ctx.req.socket.remoteAddress === '127.0.0.1' ? (ctx.request.headers.server_render_ip as string) : '';
    let ip = ssrIp || (ctx.request.headers['x-forwarded-for'] as string) || ctx.ip;
    if (ip.substr(0, 7) === '::ffff:') {
      ip = ip.substr(7);
    }
    return ip;
  }

  randomAlphanumericString(length: number): string {
    return cryptoRandomString({ length, type: 'alphanumeric' });
  }
}
