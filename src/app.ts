import fs from 'fs';
import process from 'process';
import { defaultConfig, readConfig } from './config';
import WebScraper from './web-scraper';

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

    const webScraper = new WebScraper();
    if (config.source.type !== "url") {
        console.log(`no support yet for source type ${config.source.type}`);
        return;
    }

    const doc = await webScraper.fetchDocument(config.source.value);
    console.log(doc.querySelector("head title").outerHTML)
    const elements = webScraper.extractMatches(doc, config.extraction);
    console.log(elements);
}

main();