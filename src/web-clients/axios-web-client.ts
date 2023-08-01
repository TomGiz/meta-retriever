import axios, { AxiosError } from "axios";
import WebClient from "./web-client";

export default class AxiosWebClient implements WebClient {
    get(url: string): Promise<string> {
        const html = axios
            .get(url)
            .then(res => res.data)
            .catch((error: AxiosError) => {
                console.error(`Error retrieving HTML from ${error.config.url}.`);
                console.error(error.toJSON());
            });

        return html;
    }
}