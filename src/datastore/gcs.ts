import { Storage } from "@google-cloud/storage";
import path = require("path");
import { Readable, Writable } from "stream";
import { CsvFileStore } from "../domain";

export interface GCSConfig {
    bucket: string
    prefix: string
}

export class GCS implements CsvFileStore {
    private BUCKET: string
    private PREFIX: string
    private storage: Storage

    constructor(options: GCSConfig) {
        this.BUCKET = options.bucket
        this.PREFIX = options.prefix
        this.storage = new Storage();
    }

    async listFilename(): Promise<string[]> {
        const [files, _] = await this.storage.bucket(this.BUCKET).getFiles({
            autoPaginate: false,
            delimiter: '/',
            prefix: this.PREFIX + '/',
        })
        console.log('all files in bucket: ', files)
        return files.map(f => f.name.split('/')[1])
    }

    getReadStream(filename: string): Readable {
        let fullPath = path.join(this.PREFIX, filename);
        return this.storage
            .bucket(this.BUCKET)
            .file(fullPath)
            .createReadStream();
    }

    getWriteStream(filename: string): Writable {
        throw new Error("Method not implemented.");
    }
}