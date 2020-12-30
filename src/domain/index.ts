import { Readable, Stream, Writable } from "stream";

export class Card {
    id!: string;
    name!: string;
    brand!: string;
    bank!: string;
    billing_date!: number;
}

export class CardBill {
    id!: string;
    confirmed!: boolean;
    billing_month!: Date;
    billing_date!: Date;
    total_amount!: number;
    transactions!: BillTransaction[];
}

export class BillTransaction {
    date: Date
    merchant: string
    amount: number
    memo: string

    constructor(date: Date, merchant: string, amount: number, memo: string) {
        this.date = date;
        this.merchant = merchant;
        this.amount = amount;
        this.memo = memo;
    }
}

export interface CsvFileStore {
    getReadStream(filename: string): Readable
    getWriteStream(filename: string): Writable
}

export interface CardDataStore {
    addCard(card: Card): Promise<void>
    addCardBill(cardID: string, bill: CardBill): Promise<void>
    getCards(): Promise<Card[]>
    getCardBills(cardID: string, limit: number): Promise<CardBill[]>
    getCardBillWithTransactions(cardID: string, billID: string): Promise<CardBill>
}
