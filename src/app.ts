import fs from 'fs';
import process from 'process';
import { defaultConfig, readConfig } from './config';
import WebScraper from './web-scraper';
import AxiosWebClient from './web-clients/axios-web-client';
import CachedWebClient from './web-clients/cached-web-client';
import "./extensions/array.extensions"
import "./extensions/string.extensions"
import { ConsoleLogger } from './logging/console-logger';
import { NullLogger } from './logging/null-logger';
import CsvReader from './csv/csv-reader';
import { LogLevel } from './logging/logger';

async function main() {
    var args = process.argv;
    const firstArg = (args.length > 2) ? args[2] : undefined;
    const secondArg = (args.length > 3) ? args[3] : undefined;
    const defaultConfPath = "config.json";
    const logger = new ConsoleLogger();
    logger.setLogLevel(LogLevel.Info);

    if (firstArg === "init") {
        logger.info("Initializing config file");
        fs.writeFileSync(defaultConfPath, JSON.stringify(defaultConfig(), null, 4));
        console.log(`Default config file written to ${defaultConfPath}`);
        return;
    }

    const configPath = firstArg ?? secondArg ?? defaultConfPath;
    logger.info(`Reading config from ${configPath}...`)
    const config = await readConfig(configPath);

    const webClient = new CachedWebClient(new AxiosWebClient(), logger);
    const webScraper = new WebScraper(webClient);
    if (config.source.type === "csv") {
        const csvReader = new CsvReader() ;
        const csv = await csvReader.read(config.source.path);
        const okLines: string[] = [];
        const nokLines: any[] = [];
        for(const line of csv) {
            const url = line["URL"];
            const doc = await webScraper.fetchDocument(url);
            const elements = webScraper.extractMatches(doc, config.extraction);
            if (elements.any(el => line[el.name] !== el.content.first())) {
                let nok = {URL: url};
                for (const el of elements) {
                    nok[el.name + " [Requested]"] = line[el.name]?.truncate();
                    nok[el.name + " [Found]"] = el.content.first()?.truncate();
                }
                nokLines.push(nok)
            } else {
                okLines.push(url);
            }
        }
        console.log(`Found ${okLines.length} URL that have DOM data as requested.`)
        console.log(`Found ${nokLines.length} URL that have DOM data that did not match the requested:`)
        console.table(nokLines);
        return;
    }

    const output: any[] = []
    for (const url of config.source.urls) {
        const doc = await webScraper.fetchDocument(url);
        const elements = webScraper.extractMatches(doc, config.extraction);
        let line = { url };
        for (const result of elements) {
            line[result.name] = result.content.first().truncate();
        }
        output.push(line);
    }
    console.table(output);
}

main();