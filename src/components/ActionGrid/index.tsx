import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MaxWidthLayout } from '@/layout';
import { useNavigation } from '@/hooks/useNavigation';
import { useComanda } from '@/contexts/ComandaContext';
import Image from 'next/image';

export interface ActionItem {
  icon: React.ReactNode | React.FC;
  label: string;
  href: string;
}

const ActionGridItem: React.FC<ActionItem & { isLabelBold?: boolean }> = ({
  icon: Icon,
  label,
  href,
  isLabelBold,
}) => {
  return (
    <Link href={href} className='flex flex-col text-black items-center'>
      <div
        className={`w-[64px] h-[64px] rounded-2xl flex flex-col items-center justify-center gap-[6px] bg-[#F0F0F0] shadow-lg transform hover:scale-105 transition-transform duration-200 `}
      >
        {typeof Icon === 'function' ? <Icon /> : Icon}
        <p
          className={`text-[11px] leading-[140%] text-center ${
            isLabelBold ? 'font-bold' : ''
          }`}
        >
          {label}
        </p>
      </div>
    </Link>
  );
};

export const ActionGrid: React.FC = () => {
  const { actionItems } = useNavigation();
  const [comanda, setComanda] = useState<boolean>(false);
  const { fetchComandaAtiva } = useComanda();

  useEffect(() => {
    const checkComandaAtiva = async () => {
      const comandaId = await fetchComandaAtiva();

      if (comandaId) {
        setComanda(true);
      } else {
        setComanda(false);
      }
    };

    checkComandaAtiva();
  }, [fetchComandaAtiva]);

  return (
    <MaxWidthLayout>
      <div className='flex gap-[15px] overflow-x-auto py-[20px]'>
        {actionItems.map((item) => {
          const isScanQr = item.href === '/qr-code';

          if (comanda && isScanQr) {
            return (
              <ActionGridItem
                key={item.href}
                label='Comanda'
                href='/conta/comanda'
                icon={
                  <Image
                    src='/icons/receipt.svg'
                    alt='Receipt'
                    width={16}
                    height={16}
                  />
                }
                isLabelBold={true}
              />
            );
          }
          return (
            <ActionGridItem key={item.href} {...item} isLabelBold={isScanQr} />
          );
        })}
      </div>
    </MaxWidthLayout>
  );
};
