import fs from 'fs';
import process from 'process';
import { defaultConfig, readConfig } from './config';
import WebScraper from './web-scraper';
import AxiosWebClient from './web-clients/axios-web-client';
import CachedWebClient from './web-clients/cached-web-client';
import "./util/array.extensions"
import "./util/string.extensions"

async function main() {
    var args = process.argv;
    const firstArg = (args.length > 2) ? args[2] : undefined;
    const secondArg = (args.length > 3) ? args[3] : undefined;
    const defaultConfPath = "config.json";

    if (firstArg === "init") {
        console.log("Initializing config file");
        fs.writeFileSync(defaultConfPath, JSON.stringify(defaultConfig(), null, 4));
        console.log(`Default config file written to ${defaultConfPath}`);
        return;
    }

    const configPath = firstArg ?? secondArg ?? defaultConfPath;
    console.log(`Reading config from ${configPath}...`)
    const config = await readConfig(configPath);
    // console.log(config)

    const webClient = new CachedWebClient(new AxiosWebClient());
    const webScraper = new WebScraper(webClient);
    if (config.source.type !== "url") {
        console.log(`no support yet for source type ${config.source.type}`);
        return;
    }

    const output : any[] = []
    for (const url of config.source.value) {
        const doc = await webScraper.fetchDocument(url);
        const elements = webScraper.extractMatches(doc, config.extraction);
        let line = {url};
        for (const result of elements) {
            line[result.name] = result.content.first().truncate();
        }
        output.push(line);
    }
    console.table(output);
}

main();