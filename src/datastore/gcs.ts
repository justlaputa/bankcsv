import { Readable, Writable } from "stream";
import { CsvFileStore } from "../domain";

export interface GCSConfig {
    bucket: string
    prefix: string
}

export class GCS implements CsvFileStore {
    private BUCKET: string
    private PREFIX: string

    constructor(options: GCSConfig) {
        this.BUCKET = options.bucket
        this.PREFIX = options.prefix
    }

    getReadStream(filename: string): Readable {
        throw new Error("Method not implemented.");
    }

    getWriteStream(filename: string): Writable {
        throw new Error("Method not implemented.");
    }
}