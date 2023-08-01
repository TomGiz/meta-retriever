import { readFile, writeFile } from 'fs/promises';

export type ConfigSource = {
    type: "url" | "csv";
    value: string;
}

export type CssSelector = string;
export type OutputSelector = "*" | ">" | string;

export type Extractor = {
    query: CssSelector;
    output: OutputSelector;
}

export type Config = {
    source: ConfigSource;
    destination: "stdout" | "inline";
    extraction: Extractor[];
}

export function defaultConfig(): Config {
    return {
        source: {
            type: "url",
            value: "http://..."
        },
        destination: "stdout",
        extraction: [
            {
                query: "head title",
                output: "*"
            }
        ]
    }
}

export async function readConfig(path: string) : Promise<Config> {
    const buffer = await readFile(path);
    const serialized = buffer.toString();
    return JSON.parse(serialized) as Config;
}