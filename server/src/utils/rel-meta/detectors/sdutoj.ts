import { Provide } from 'bwcx-core';
import { IRelMeta } from '@server/interfaces/rel-meta';
import { AbstractRelDetector } from './abstract';

enum ESolutionResult {
  WT = 0,
  JG = 12,
  AC = 1,
  TLE = 2,
  MLE = 3,
  WA = 4,
  RTE = 5,
  OLE = 6,
  CE = 7,
  PE = 8,
  SE = 11,

  RPD = -1,
  CNL = -2,

  // virtual
  V_Frozen = -100,
}

const oj2SrkResultMap = {
  [ESolutionResult.AC]: 'AC',
  [ESolutionResult.TLE]: 'TLE',
  [ESolutionResult.MLE]: 'MLE',
  [ESolutionResult.WA]: 'WA',
  [ESolutionResult.RTE]: 'RTE',
  [ESolutionResult.OLE]: 'OLE',
  [ESolutionResult.CE]: 'CE',
  [ESolutionResult.PE]: 'PE',
  [ESolutionResult.SE]: 'UKE',

  [ESolutionResult.WT]: null,
  [ESolutionResult.JG]: null,
  [ESolutionResult.RPD]: null,
  [ESolutionResult.V_Frozen]: '?',
};

@Provide()
export default class RelMetaDetectorSDUTOJ extends AbstractRelDetector {
  private readonly icon = 'https://oj.sdutacm.cn/onlinejudge3/favicon.ico';

  private parseResponse(resp: any): any {
    if (resp.status >= 400) {
      throw new Error(`HTTP error: ${resp.status}`);
    }
    if (!(typeof resp.data === 'object' && 'success' in resp.data)) {
      throw new Error('Invalid API response');
    }
    if (resp.data.success === false) {
      throw new Error(`API error: ${resp.data.msg} (${resp.data.code})`);
    }
    return resp.data.data;
  }

  private convertSDUTOJResult(result: number): string | null {
    return oj2SrkResultMap[result];
  }

  public constructor() {
    super();
    this.initFetcher({
      baseURL: 'https://oj.sdutacm.cn/onlinejudge3/api',
    });
  }

  public async detect(relLink: string, url: URL): Promise<IRelMeta | null | false> {
    if (url.host !== 'oj.sdutacm.cn' || !url.pathname.startsWith('/onlinejudge3/')) {
      return false;
    }
    let resBase: IRelMeta = {
      url: relLink,
      title: 'SDUTOJ',
      icon: this.icon,
      platform: {
        id: 'sdutoj',
        label: 'SDUTOJ',
      }
    };
    let res: IRelMeta | null = null;
    let match: RegExpMatchArray;
    // problem
    match = url.pathname.match(/^\/onlinejudge3\/problems\/(\d+)$/);
    if (match) {
      const id = match[1];
      const resp = await this.fetcher({
        method: 'POST',
        url: `/getProblemDetail`,
        data: {
          problemId: +id,
        },
      }).then((resp) => this.parseResponse(resp));
      return (res = {
        ...resBase,
        title: `Problem ${id} - ${resp.title}`,
        id,
        problem: {
          id,
          title: resp.title,
        },
      });
    }
    // solution
    match = url.pathname.match(/^\/onlinejudge3\/solutions\/(\d+)$/);
    if (match) {
      const id = match[1];
      const resp = await this.fetcher({
        method: 'POST',
        url: `/getSolutionDetail`,
        data: {
          solutionId: +id,
        },
      }).then((resp) => this.parseResponse(resp));
      const result = this.convertSDUTOJResult(resp.result) || undefined;
      const lang = this.parseLanguage(resp.language);
      return (res = {
        ...resBase,
        title: `Solution ${id} - Problem ${resp.problem.problemId} - ${lang.label} - ${result}`,
        id,
        solution: {
          id,
          result,
          language: lang.id,
        },
        problem: {
          id: resp.problem.problemId.toString(),
          title: resp.problem.title,
        },
        user: {
          id: resp.user.userId.toString(),
          nickname: resp.user.nickname,
        },
      });
    }
    return res;
  }
}
