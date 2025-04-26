import { motion } from 'framer-motion';
import React from 'react';
import { useComanda } from '@/contexts/ComandaContext';
import { AnimatePresence } from 'framer-motion';

export const CartEmptyError = () => {
  const { isCartEmptyErrorOpen, setIsCartEmptyErrorOpen } = useComanda();

  React.useEffect(() => {
    if (isCartEmptyErrorOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartEmptyErrorOpen]);

  return (
    <AnimatePresence>
      {isCartEmptyErrorOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsCartEmptyErrorOpen(false);
            }}
            className='fixed inset-0 bg-black/50 z-[45] pointer-events-auto '
          />
          <motion.div
            initial={{ y: '222px' }}
            animate={{ y: 0 }}
            exit={{ y: '222px' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed bottom-[132px] left-0 right-0 bg-white p-6 rounded-[8px] z-[46] pointer-events-auto mx-[32px] flex flex-col gap-[12px]`}
          >
            <div
              className='absolute top-[21px] right-[21px] cursor-pointer'
              onClick={() => {
                setIsCartEmptyErrorOpen(false);
              }}
            >
              <svg
                width='12'
                height='12'
                viewBox='0 0 12 12'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M11 1L1 11M1 1L11 11'
                  stroke='#1E1E1E'
                  stroke-width='1.6'
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </div>
            <h1 className='text-[24px] font-[600] leading-[32px] tracking-[0.5px] text-[#FFCC00]'>
              Ops!
            </h1>
            <p className='text-[14px] font-[600] leading-[16px] tracking-[0.5px] text-[#1E1E1E] '>
              Você precisa adicionar um item no carrinho para continuar!
            </p>

            <div className='absolute bottom-[-24px] right-[24px]'>
              <svg
                width='22'
                height='38'
                viewBox='0 0 22 38'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M22 38L0 0H22V38Z' fill='white' />
              </svg>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
