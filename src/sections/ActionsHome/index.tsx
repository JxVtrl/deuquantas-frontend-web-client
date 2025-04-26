import { ActionSquared } from '@deuquantas/components';
import { SwiperSlide } from 'swiper/react';
import React from 'react';
import { useRouter } from 'next/router';
import { useNavigation } from '@/hooks/useNavigation';
import { Carousel } from '@/components/Carousel';

export const ActionsHome = () => {
  const { actionItems } = useNavigation();
  const router = useRouter();

  // const actionsResolved = actionItems.map((item) => {
  //     if (item.href === '/qr-code' && comanda) {
  //         return {
  //             onClick: () => {
  //                 router.push('/conta/comanda');
  //             },
  //             label: 'Comanda',
  //             icon: ReceiptIcon as () => React.JSX.Element,
  //         };
  //     }
  //     return {
  //         onClick: () => {
  //             router.push(item.href);
  //         },
  //         label: item.label,
  //         icon: item.icon as () => React.JSX.Element,
  //     };
  // });
  return (
    <Carousel
      style={{
        padding: '20px 0',
      }}
      spaceBetween={15}
    >
      {actionItems.map((action) => (
        <SwiperSlide
          key={action.label}
          style={{
            width: 'fit-content',
          }}
        >
          <ActionSquared
            {...action}
            onClick={() => {
              router.push(action.href);
            }}
          />
        </SwiperSlide>
      ))}
    </Carousel>
  );
};
