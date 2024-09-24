import { Inject, Provide } from 'bwcx-core';
import RelMetaDetectorIndex from './detectors';
import { IRelMeta } from '@server/interfaces/rel-meta';

@Provide()
export default class RelMetaUtils {
  @Inject()
  private readonly relMetaDetectorIndex: RelMetaDetectorIndex;

  public async autoDetect(relLink: string, urlObject: URL): Promise<IRelMeta | null> {
    for (const detector of this.relMetaDetectorIndex.detectors) {
      try {
        const pieceRelMeta = await detector.detect(relLink, urlObject);
        if (pieceRelMeta === false) {
          continue;
        }
        return pieceRelMeta;
      } catch (e) {
        console.error(`Failed to detect url "${relLink}" with detector ${detector.constructor.name}:`, e);
        break;
      }
    }
    return null;
  }
}
