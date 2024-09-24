import Axios, { type AxiosRequestConfig, type AxiosInstance, type AxiosResponse } from 'axios';
import http from 'http';
import https from 'https';
import { IRelMeta } from '@server/interfaces/rel-meta';

export abstract class AbstractRelDetector {
  fetcher: AxiosInstance;

  protected initFetcher(config: AxiosRequestConfig = {}) {
    const httpAgent = new http.Agent({ keepAlive: true });
    const httpsAgent = new https.Agent({ keepAlive: true });
    this.fetcher = Axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'PasteThenACCrawler/1.0.0',
      },
      httpAgent,
      httpsAgent,
      ...config,
    });
    return this.fetcher;
  }

  protected parseLanguage(lang: string): { id: string; label: string } {
    switch (lang.toLowerCase()) {
      case '':
      case 'txt':
      case 'plain':
      case 'plaintext':
        return { id: 'plaintext', label: 'Plain Text' };
      case 'gcc':
      case 'c':
        return { id: 'c', label: 'C' };
      case 'g++':
      case 'cpp':
      case 'c++':
        return { id: 'cpp', label: 'C++' };
      case 'java':
        return { id: 'java', label: 'Java' };
      case 'python':
      case 'python2':
      case 'pytho3':
        return { id: 'python', label: 'Python' };
      case 'pascal':
        return { id: 'pascal', label: 'Pascal' };
      case 'ruby':
        return { id: 'ruby', label: 'Ruby' };
      case 'rust':
      case 'rs':
        return { id: 'rust', label: 'Rust' };
      case 'perl':
        return { id: 'perl', label: 'Perl' };
      case 'php':
        return { id: 'php', label: 'PHP' };
      case 'go':
        return { id: 'go', label: 'Go' };
      case 'haskell':
        return { id: 'haskell', label: 'Haskell' };
      case 'lua':
        return { id: 'lua', label: 'Lua' };
      case 'bash':
        return { id: 'bash', label: 'Bash' };
      case 'javascript':
      case 'js':
        return { id: 'javascript', label: 'JavaScript' };
      case 'typescript':
      case 'ts':
        return { id: 'typescript', label: 'TypeScript' };
      case 'scala':
        return { id: 'scala', label: 'Scala' };
      case 'kotlin':
      case 'kt':
        return { id: 'kotlin', label: 'Kotlin' };
      case 'swift':
        return { id: 'swift', label: 'Swift' };
      case 'c#':
      case 'csharp':
      case 'cs':
        return { id: 'csharp', label: 'C#' };
      case 'r':
        return { id: 'r', label: 'R' };
      case 'latex':
        return { id: 'latex', label: 'LaTeX' };
      case 'markdown':
      case 'md':
        return { id: 'markdown', label: 'Markdown' };
      case 'objective-c':
      case 'objectivec':
        return { id: 'objective-c', label: 'Objective-C' };
      case 'xml':
        return { id: 'xml', label: 'XML' };
      case 'yaml':
        return { id: 'yaml', label: 'YAML' };
      case 'json':
        return { id: 'json', label: 'JSON' };
      default:
        return { id: lang.toLowerCase(), label: lang };
    }
  }

  abstract detect(relLink: string, url: URL): Promise<IRelMeta | null | false>;
}
