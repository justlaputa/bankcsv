import { BillTransaction, Card, CardBill, CardDataStore } from "../domain";

export interface FireStoreConfig {
    cardCollectionName: string
}

class FireStore implements CardDataStore {
    private C_CARD: string
    private C_BILL: string = "bills"
    private C_TRANSACTION: string = "transactions"

    constructor(options: FireStoreConfig) {
        this.C_CARD = options.cardCollectionName;
    }

    addCard(id: string, card: Card): void {
        throw new Error("Method not implemented.");
    }
    addCardBill(cardID: string, bill: CardBill): void {
        throw new Error("Method not implemented.");
    }
    getCards(): Card[] {
        throw new Error("Method not implemented.");
    }
    getCardBills(cardID: string, limit: number): CardBill[] {
        throw new Error("Method not implemented.");
    }
    getCardBillWithTransactions(cardID: string, billID: string): BillTransaction[] {
        throw new Error("Method not implemented.");
    }
}

export { FireStore };