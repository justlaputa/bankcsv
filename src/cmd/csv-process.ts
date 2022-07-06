import { CsvProcesser } from "../csv-processer";
import { GCPFireStore } from "../datastore/firestore";
import { GCS } from "../datastore/gcs";

async function main() {
    const filestore = new GCS({
        bucket: 'financial-data-files',
        prefix: 'bankcsv',
    });
    const db = new GCPFireStore({
        cardCollectionName: 'Cards',
    })
    const csvProcesser = new CsvProcesser(filestore, db);

    await csvProcesser.process('vpass_linepay_20210226.csv');
    //await csvProcesser.processAll();
}

main().then(
    () => console.log('done'),
    console.error
);