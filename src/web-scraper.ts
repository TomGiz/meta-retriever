import axios, { AxiosError } from 'axios';
import { JSDOM } from 'jsdom';
import { Extractor, OutputSelector } from './config';

export type WebScrapedElement = {
    selector: string;
    content: string[];
}

export default class WebScraper {
    constructor() {
    }
    async fetchPage(url: string): Promise<string | undefined> {
        const html = axios
            .get(url)
            .then(res => res.data)
            .catch((error: AxiosError) => {
                console.error(`Error retrieving HTML from ${error.config.url}.`);
                console.error(error.toJSON());
            });

        return html;
    }
    async fetchDocument(url: string) {
        const page = await this.fetchPage(url);
        const dom = new JSDOM(page);
        return dom.window.document;
    }
    extractMatches(document: Document, extractors: Extractor[]): WebScrapedElement[] {
        return extractors.map(ex => {
            return { selector: ex.query, content: Array.from(document.querySelectorAll(ex.query)).map(el => this.extractContent(el, ex.output)) };
        });
    }
    private extractContent(el: Element, os: OutputSelector) {
        switch(os) {
            case "*": return el.outerHTML;
            case ">": return el.innerHTML;
            default: return el.getAttribute(os);
        }
    }
}