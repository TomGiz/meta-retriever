import axios, { AxiosError } from 'axios';
import { JSDOM } from 'jsdom';
import { Extractor, OutputSelector } from './config';
import WebClient from './web-clients/web-client';

export type WebScrapedElement = {
    selector: string;
    content: string[];
}

export default class WebScraper {
    private _webClient: WebClient;
    constructor(webClient: WebClient) {
        this._webClient = webClient;
    }
    async fetchPage(url: string): Promise<string | undefined> {
        return this._webClient.get(url);
    }
    async fetchDocument(url: string) {
        const page = await this.fetchPage(url);
        const dom = new JSDOM(page);
        return dom.window.document;
    }
    extractMatches(document: Document, extractors: Extractor[]): WebScrapedElement[] {
        return extractors.map(ex => {
            const content = Array.from(document.querySelectorAll(ex.query)).map(el => this.extractContent(el, ex.output));
            return { selector: ex.query, content: content };
        });
    }
    private extractContent(el: Element, os: OutputSelector) {
        switch (os) {
            case "*": return el.outerHTML;
            case ">": return el.innerHTML;
            default: return el.getAttribute(os);
        }
    }
}