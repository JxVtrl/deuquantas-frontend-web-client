export interface HomeTabs {
    id: number;
    value: HomeTabList;
    title: string;
    content: React.ReactNode;
};

export type HomeTabList = 'qr-code' | 'purchase-history' | 'payment-credit' | 'purchase-limit'