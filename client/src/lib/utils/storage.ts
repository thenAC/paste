import type { UserPieceConfig } from '$lib/interfaces/piece';

export function getStorage(key: string) {
  return localStorage.getItem(key);
}

export function setStorage(key: string, value: string) {
  return localStorage.setItem(key, value);
}

export function removeStorage(key: string) {
  return localStorage.removeItem(key);
}

export function clearStorage() {
  return localStorage.clear();
}

export class UserPieceStorage {
  private key = 'pieceConfig';

  private getDefaultConfig() {
    return {
      ttl: -1,
    };
  }

  public get(): UserPieceConfig {
    try {
      return JSON.parse(getStorage(this.key)!) || this.getDefaultConfig();
    } catch (e) {
      return this.getDefaultConfig();
    }
  }

  public set(config: UserPieceConfig) {
    return setStorage(this.key, JSON.stringify(config));
  }

  public remove() {
    return removeStorage(this.key);
  }
}

export const userPieceStorage = new UserPieceStorage();
