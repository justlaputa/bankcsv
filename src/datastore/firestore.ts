import { CollectionReference, Firestore } from "@google-cloud/firestore";
import { Card, CardBill, CardDataStore } from "../domain";

export interface FireStoreConfig {
    cardCollectionName: string
}

class GCPFireStore implements CardDataStore {
    private C_CARD: string
    private C_BILL: string = "bills"
    private C_TRANSACTION: string = "transactions"
    private firestore: Firestore
    private cardCollection: CollectionReference

    constructor(options: FireStoreConfig) {
        this.C_CARD = options.cardCollectionName;
        this.firestore = new Firestore();
        this.cardCollection = this.firestore.collection(this.C_CARD);
    }

    addCard(card: Card): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async addCardBill(cardID: string, bill: CardBill): Promise<void> {
        let billRef = this.cardCollection
            .doc(cardID)
            .collection(this.C_BILL)
            .doc(bill.id);

        await billRef.set({
            total_amount: bill.total_amount    
        })

        let billTxRef = billRef.collection(this.C_TRANSACTION);

        for (let i = 0; i < bill.transactions.length; i++) {
            let tx = bill.transactions[i]
            let name = String(i + 1).padStart(3, '0');
            
            await billTxRef.doc(name).set({
                date: tx.date,
                merchant: tx.merchant,
                amount: tx.amount,
                memo: tx.memo,
            });
        }
    }

    getCards(): Promise<Card[]> {
        throw new Error("Method not implemented.");
    }
    getCardBills(cardID: string, limit: number): Promise<CardBill[]> {
        throw new Error("Method not implemented.");
    }
    getCardBillWithTransactions(cardID: string, billID: string): Promise<CardBill> {
        throw new Error("Method not implemented.");
    }

}

export { GCPFireStore };