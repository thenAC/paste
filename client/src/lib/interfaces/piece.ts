export interface UserPieceConfig {
  ttl: number;
}

export interface Piece {
  key: string;
  lang: string;
  code: string;
  author: number;
  rel?: string;
  relLinks?: string[];
  expireAt: string; // Date
  createdAt: string; // Date
}
