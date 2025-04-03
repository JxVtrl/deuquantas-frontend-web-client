import React from 'react';

export const HistoryEmpty: React.FC<{ notFound?: boolean }> = ({
  notFound = false,
}) => {
  return (
    <div
      style={{
        paddingTop: '24px',
        height: '60vh',
      }}
    >
      <p className='font-[400] text-black text-[14px] leading-[24px] m-0'>
        {notFound ? (
          <>Nenhum resultado encontrado.</>
        ) : (
          <>
            Você não possuí <b>nenhuma</b> compra realizada.
          </>
        )}
      </p>
    </div>
  );
};
