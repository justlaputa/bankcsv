import { CardDataStore, CsvFileStore } from "../domain";
import { FireStore } from "./firestore";
import { GCS } from "./gcs";

export function newCardDataStore(cardCollectionName: string): CardDataStore {
    return new FireStore({ cardCollectionName });
}

export function newCsvFileStore(bucket: string, prefix: string): CsvFileStore {
    return new GCS({
        bucket,
        prefix
    });
}