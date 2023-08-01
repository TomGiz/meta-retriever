import fs from 'fs';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { resolve } from 'path';
import WebClient from './web-client';

async function fileExists(file: fs.PathLike) {
    return await fs.promises.access(file, fs.constants.F_OK)
             .then(() => true)
             .catch(() => false)
  }

export default class CachedWebClient implements WebClient {
    private _webClient: WebClient;
    constructor(webClient: WebClient) {
        this._webClient = webClient;
    }
    async get(url: string): Promise<string> {
        // If the cache folder doesn't exist, create it
        const cacheDirPath =resolve(__dirname, '.cache')
        if (await fileExists(cacheDirPath) === false) {
            await mkdir(cacheDirPath);
        }
        console.log(`Getting data for ${url}...`);
        const filePath = resolve(__dirname, `.cache/${Buffer.from(url).toString('base64')}.html`)
        if (await fileExists(filePath) === true) {
            console.log(`I read ${url} from cache`);
            return await readFile(filePath, { encoding: 'utf8' });
        } else {
            console.log(`I fetched ${url} fresh`);
            const html = await this._webClient.get(url);
            if (html) {
                await writeFile(filePath, html, { encoding: 'utf8' },);
            }
            return html;
        }
    }

}