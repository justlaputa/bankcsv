import path = require("path");
import { pipeline, Writable } from "stream";
import { BillTransaction, CardBill, CardDataStore, CsvFileStore } from "../domain"
import { CsvDataTransformers, tokyuCardParser, vpassCardParser, yahooCardParser } from "./parsers";

export class CsvProcesser {
    private csvFileStore: CsvFileStore
    private cardDataStore: CardDataStore

    constructor(fileStore: CsvFileStore, cardStore: CardDataStore) {
        this.csvFileStore = fileStore;
        this.cardDataStore = cardStore;
    }

    async processAll(): Promise<void> {
        const filenames = await this.csvFileStore.listFilename()
        console.debug('list files in bucket: ', filenames)
        for (let filename of filenames) {
            await this.process(filename)
        }
    }

    async process(filename: string): Promise<void> {
        let [cardBrand, cardName, billID] = this.parseFilename(filename)

        let rs = this.csvFileStore.getReadStream(filename)
        let parser = this.getParserFromCardBrand(cardBrand)
        let cardID = `${cardBrand}:${cardName}`
        let ws = this.getCardDataStoreWriteSteam(cardID, billID)

        pipeline(rs, parser.csvTransform, parser.billTransform, ws, () => {})
    }

    private parseFilename(filename: string): [string, string, string] {
        const name = path.parse(filename).name
        const parts = name.split('_');
        return [parts[0], parts[1], parts[2]];
    }

    private getCardDataStoreWriteSteam(cardID: string, billID: string): Writable {
        const bill = new CardBill()
        bill.id = billID;

        return new TransactionWritable(
            async (transactions, total) => {
                bill.transactions = transactions;
                bill.total_amount = total;
                await this.cardDataStore.addCardBill(cardID, bill);
            },
            {}
        );
    }

    private getParserFromCardBrand(cardID: string): CsvDataTransformers {
        const parserMap = new Map<string, CsvDataTransformers>([
            ['yahoo', yahooCardParser()],
            ['vpass', vpassCardParser()],
            ['tokyu', tokyuCardParser()],
        ]);

        const result = parserMap.get(cardID);
        if (!result) {
            throw new Error(`can not find parser for card: ${cardID}`);
        }

        return result;
    }
}

type TransactionWriteFunction = (txs: BillTransaction[], total: number) => Promise<void>;

class TransactionWritable extends Writable {
    txWriteFunc: TransactionWriteFunction
    transactions: BillTransaction[]
    totalAmount: number

    constructor(txWriteFunc: TransactionWriteFunction, options: any) {
        let o = Object.assign({objectMode: true}, options);
        super(o);
        this.txWriteFunc = txWriteFunc;
        this.transactions = [];
        this.totalAmount = 0;
    }

    _write(chunk: any, encoding: string, callback: Function) {
        let tx = (<BillTransaction>chunk);
        console.log('add tx: ', tx);
        if (typeof tx.amount === 'number') {
            this.totalAmount += tx.amount;
        }
        this.transactions.push(tx);
        callback();
    }

    _final(callback: Function) {
        this.txWriteFunc(this.transactions, this.totalAmount)
            .finally(() => callback());
    }
}