import { Provide } from 'bwcx-core';
import RelMetaDetectorSDUTOJ from './sdutoj';
import { AbstractRelDetector } from './abstract';

export const relMetaDectors = [];

@Provide()
export default class RelMetaDetectorIndex {
  public detectors: AbstractRelDetector[];

  constructor(detectorSDUTOJ: RelMetaDetectorSDUTOJ) {
    this.detectors = [detectorSDUTOJ];
  }
}
