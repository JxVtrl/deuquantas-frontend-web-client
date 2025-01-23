export interface PurchaseHistoryItem {
    id: string;
    date: string;
    total: number;
    establishment: {
        name: string;
    }
}