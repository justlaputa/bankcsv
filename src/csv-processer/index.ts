import { pipeline, Stream, Transform, Writable } from "stream";
import { CardDataStore, CsvFileStore } from "../domain"

class CsvProcesser {
    private csvFileStore: CsvFileStore
    private cardDataStore: CardDataStore

    constructor(fileStore: CsvFileStore, cardStore: CardDataStore) {
        this.csvFileStore = fileStore;
        this.cardDataStore = cardStore;
    }

    async process(filename: string): Promise<void> {
        let [cardID, billID] = this.parseFilename(filename)

        let rs = this.csvFileStore.getReadStream(filename)
        let parser = this.getParserFromCardID(cardID)
        let firestoreWriter = this.getFileStoreWriteSteam(cardID, billID)

        pipeline(rs, parser, firestoreWriter)
    }

    private parseFilename(filename: string): [string, string] {
        throw new Error("Method not implemented.");
    }

    private getFileStoreWriteSteam(cardID: string, billID: string): Writable {
        throw new Error("Method not implemented.");
    }

    private getParserFromCardID(filename: string): Transform {
        throw new Error("Method not implemented.");
    }
}