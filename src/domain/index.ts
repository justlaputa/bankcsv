import { Readable, Stream, Writable } from "stream";

export interface Card {
    id: string
    name: string
    brand: string
    bank: string
    billing_date: number
}

export interface CardBill {
    id: string
    confirmed: boolean
    billing_month: Date
    billing_date: Date
    total_amount: number
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
    addCard(id: string, card: Card): void
    addCardBill(cardID: string, bill: CardBill): void
    getCards(): Card[]
    getCardBills(cardID: string, limit: number): CardBill[]
    getCardBillWithTransactions(cardID: string, billID: string): BillTransaction[]
}
