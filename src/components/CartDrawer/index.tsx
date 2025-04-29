import { useComanda } from '@/contexts/ComandaContext';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { capitalize, currencyFormatter } from '@/utils/formatters';
import { Counter } from '../Counter';
import { Drawer, MaxWidthWrapper } from '@deuquantas/components';

export const CartDrawer = () => {
  const [quantidade, setQuantidade] = useState(1);
  const [total, setTotal] = useState(0);
  const { clearCart, selectedItem, itensInCart, setItensInCart } = useComanda();

  useEffect(() => {
    setQuantidade(
      itensInCart.find((item) => item.id === selectedItem?.id)?.quantidade || 1,
    );
  }, [selectedItem]);

  const handleQuantidadeChange = (value: number) => {
    setQuantidade(value);

    if (value === 0) {
      clearCart();
    } else {
      setItensInCart(
        itensInCart.map((item) =>
          item.id === selectedItem?.id ? { ...item, quantidade: value } : item,
        ),
      );
    }
  };

  useEffect(() => {
    setTotal(
      itensInCart.reduce(
        (acc, item) => acc + item.preco * (item.quantidade || 0),
        0,
      ),
    );
  }, [itensInCart]);

  return (
    <Drawer isOpen={!!selectedItem} onClose={clearCart}>
      <MaxWidthWrapper
        styleContent={{
          position: 'relative',
        }}
      >
        <button
          onClick={clearCart}
          className='absolute top-[16px] right-[16px]'
        >
          <svg
            width='10'
            height='10'
            viewBox='0 0 10 10'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M1.26659 9.66671L0.333252 8.73337L4.06659 5.00004L0.333252 1.26671L1.26659 0.333374L4.99992 4.06671L8.73325 0.333374L9.66659 1.26671L5.93325 5.00004L9.66659 8.73337L8.73325 9.66671L4.99992 5.93337L1.26659 9.66671Z'
              fill='#272727'
            />
          </svg>
        </button>

        <div className='flex gap-[8px] pb-[81px] py-6'>
          <Image
            src='/products/beer.webp'
            alt={selectedItem?.nome || ''}
            width={100}
            height={100}
          />
          <div>
            <h1 className='text-[12px] font-[600] leading-[24px] tracking-[0.5px] text-[#000000]'>
              {capitalize(selectedItem?.nome || '')}
            </h1>
            <p className='text-[12px] font-[400] leading-[16px] tracking-[0.5px] text-[#000000]'>
              {selectedItem?.descricao || ''}
            </p>
            <p className='text-[14px] font-[600] leading-[16px] tracking-[0.5px] text-[#272727]'>
              {currencyFormatter(total || 0)}
            </p>

            <Counter value={quantidade} onChange={handleQuantidadeChange} />
          </div>
        </div>
      </MaxWidthWrapper>
    </Drawer>
  );
};
