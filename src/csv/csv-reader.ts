import fs from 'fs';
import csv from 'csv-parser';

export default class CsvReader {
    async read(filePath: string): Promise<object[]> {
        const results: object[] = [];
      
        return new Promise((resolve, reject) => {
          fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
        });
      }
}

