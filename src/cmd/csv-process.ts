import { CsvProcesser } from "../csv-processer";
import { GCPFireStore } from "../datastore/firestore";
import { GCS } from "../datastore/gcs";

async function main() {
    const filestore = new GCS({
        bucket: 'general-test-tmp',
        prefix: 'bankcsv',
    });
    const db = new GCPFireStore({
        cardCollectionName: 'Cards',
    })
    const csvProcesser = new CsvProcesser(filestore, db);

    await csvProcesser.process('yahoo_yj_20201127.csv');
}

main().then(
    () => console.log('done'),
    console.error
);