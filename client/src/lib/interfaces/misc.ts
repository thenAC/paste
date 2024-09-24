export type RelMetaContestTimeStatus = 'Pending' | 'Registering' | 'Running' | 'Ended';
export type RelMetaSolutionResult =
  | 'AC'
  | 'RJ'
  | 'RB'
  | '?'
  | 'WA'
  | 'PE'
  | 'TLE'
  | 'MLE'
  | 'OLE'
  | 'RTE'
  | 'NOUT'
  | 'CE'
  | 'UKE'
  | string;

export interface IRelMeta {
  url: string;
  title: string;
  icon?: string;
  id?: string;

  // The following fields are algorithm contest platform specific.
  platform: {
    id: string;
    label: string;
  };
  problem?: {
    id?: string;
    title?: string;
  };
  user?: {
    id?: string;
    username?: string;
    nickname?: string;
  };
  contest?: {
    id?: string;
    title?: string;
    timeStatus?: RelMetaContestTimeStatus;
  };
  solution?: {
    id?: string;
    result?: RelMetaSolutionResult;
    language?: string;
  };
}
