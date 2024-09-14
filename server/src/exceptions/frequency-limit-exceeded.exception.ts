import { Exception } from 'bwcx-ljsm';

export default class FrequencyLimitExceededException extends Exception {
  public limit: number;
  public duration: number;

  public constructor(limit: number, duration: number) {
    super(`FrequencyLimitExceededException`);
    this.name = 'FrequencyLimitExceededException';
    this.limit = limit;
    this.duration = duration;
  }
}
