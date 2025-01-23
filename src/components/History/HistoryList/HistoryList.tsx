import { useCustomerContext } from '@/contexts/CustomerContext';
import { handlePurchaseHistory } from '@/utils/handlePurchaseHistory';
import React, { useEffect } from 'react';
import styles from './HistoryList.module.scss';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { currencyFormatter } from '@/utils/currencyFormatter';
import { timeFormatter } from '@/utils/timeFormatter';
import { HistoryInput } from '../HistoryInput';
import { PurchaseHistoryItem } from '@/interfaces/purchase';
import { HistoryEmpty } from '../HistoryEmpty';

export const HistoryList: React.FC = () => {
    const [search, setSearch] = React.useState('');
    const [filteredHistory, setFilteredHistory] = React.useState<Record<string, PurchaseHistoryItem[]>>({});
    const { purchaseHistory } = useCustomerContext()
    const purchase_list = handlePurchaseHistory(purchaseHistory);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredHistory(purchase_list);
        } else {
            const filtered = Object.keys(purchase_list).reduce((acc, dateKey) => {
                const filteredItems = purchase_list[dateKey].filter(purchase =>
                    purchase.establishment.name.toLowerCase().includes(search.toLowerCase())
                );

                if (filteredItems.length > 0) {
                    acc[dateKey] = filteredItems;
                }
                return acc;
            }, {} as Record<string, PurchaseHistoryItem[]>);

            setFilteredHistory(filtered);
        }
    }, [search, purchase_list]);

    return (
        <div>
            <HistoryInput value={search} onChange={setSearch} />

            {Object.keys(filteredHistory).length > 0 ? (
                Object.keys(filteredHistory).map((dateKey) => (
                    <div key={dateKey} className={styles.history_list_block}>
                        <span>{dateKey}</span>
                        <div className={styles.history_list}>
                            {filteredHistory[dateKey].map((purchase) => (
                                <div key={purchase.id} className={styles.history_list_item}>
                                    <div className={styles.history_list_item_left}>
                                        <Avatar className='h-[48px] w-[48px]'>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div className={styles.history_list_item_left_info}>
                                            <h2 className={styles.history_list_item_left_info_title}>
                                                {purchase.establishment.name}
                                            </h2>
                                            <span className={styles.history_list_item_left_info_date}>
                                                {timeFormatter(purchase.date)}
                                            </span>
                                        </div>
                                    </div>

                                    <span className={styles.history_list_item_right}>
                                        {currencyFormatter(purchase.total)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <HistoryEmpty notFound />
            )}
        </div>
    );
};