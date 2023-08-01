import { readFile, writeFile } from 'fs/promises';

export type ConfigSource = {
    type: "url";
    value: string[];
} | {
    type: "csv";
    value: string;
}

export type CssSelector = string;
export type OutputSelector = "*" | ">" | string;

export type Extractor = {
    name: string;
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
            value: ["https://..."]
        },
        destination: "stdout",
        extraction: [
            {
                name: "Title",
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