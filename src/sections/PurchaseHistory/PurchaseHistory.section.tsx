import { useCustomerContext } from '@/contexts/CustomerContext';
import React from 'react';
import styles from './PurchaseHistory.module.scss'
import { HistoryEmpty, HistoryFilter, HistoryList } from '@/components/History';

export const PurchaseHistory: React.FC = () => {
    const { purchaseHistory } = useCustomerContext()

    if (purchaseHistory.length === 0 ||
        purchaseHistory === undefined ||
        purchaseHistory === null
    ) {
        return (
            <HistoryEmpty />
        )
    }

    return (<div>
        <div className={styles.purchase_history_header}>
            <span className={styles.purchase_history_title}>
                Histórico
            </span>
            <HistoryFilter />
        </div>

        <HistoryList />
    </div>);
}
