import fs from 'fs';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { resolve } from 'path';
import WebClient from './web-client';
import Logger from '../logging/logger';

async function fileExists(file: fs.PathLike) {
    return await fs.promises.access(file, fs.constants.F_OK)
             .then(() => true)
             .catch(() => false)
  }

export default class CachedWebClient implements WebClient {
    private _webClient: WebClient;
    private _logger: Logger;
    constructor(webClient: WebClient, logger: Logger) {
        this._webClient = webClient;
        this._logger = logger;
    }
    async get(url: string): Promise<string> {
        // If the cache folder doesn't exist, create it
        const cacheDirPath =resolve(__dirname, '.cache')
        if (await fileExists(cacheDirPath) === false) {
            await mkdir(cacheDirPath);
        }
        this._logger.trace(`Getting data for ${url}...`);
        const filePath = resolve(__dirname, `.cache/${Buffer.from(url).toString('base64url')}.html`)
        if (await fileExists(filePath) === true) {
            this._logger.info(`Retrieved ${url} from cache`);
            return await readFile(filePath, { encoding: 'utf8' });
        } else {
            this._logger.info(`Fetched ${url} fresh`);
            const html = await this._webClient.get(url);
            if (html) {
                await writeFile(filePath, html, { encoding: 'utf8' },);
            }
            return html;
        }
    }

}