import { PurchaseHistoryItem } from '@/interfaces/purchase';

export const handlePurchaseHistory = (purchaseList: PurchaseHistoryItem[]) => {
  const purchaseHistoryByDate = purchaseList.reduce(
    (acc: { [key: string]: typeof purchaseList }, purchase) => {
      const date = new Date(purchase.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const dayBeforeYesterday = new Date(yesterday);
      dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);

      let dateKey = `${date.getDate()} ${date.getMonth()}`;
      if (date.getFullYear() !== today.getFullYear()) {
        dateKey += ` ${date.getFullYear()}`;
      }

      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Hoje';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Ontem';
      } else if (date.toDateString() === dayBeforeYesterday.toDateString()) {
        dateKey = 'Anteontem';
      }

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push(purchase);

      return acc;
    },
    {},
  );

  return purchaseHistoryByDate;
};
