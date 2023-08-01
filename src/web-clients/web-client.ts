export default interface WebClient {
    get(url: string): Promise<string>;
}