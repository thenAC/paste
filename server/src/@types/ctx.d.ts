import 'bwcx-ljsm';

declare module 'bwcx-ljsm' {
  interface RequestContext {
    // add your extra ctx properties
    info: (...messages: any[]) => void;
    warn: (...messages: any[]) => void;
    error: (...messages: any[]) => void;
  }
}
