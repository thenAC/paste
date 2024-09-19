const isProd = import.meta.env.MODE === 'production';

export const apiConfig = {
  logic: {
    baseURL: isProd ? 'https://paste.then.ac.api.algoux.cn/api' : 'http://127.0.0.1:3031/api',
  },
  pieceDist: {
    baseURL: 'https://thenac.cdn.blueverse.cc/paste/'
  },
};
