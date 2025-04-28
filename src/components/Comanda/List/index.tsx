import { useComanda } from '@/contexts/ComandaContext';
import { MaxWidthWrapper } from '@deuquantas/components';
import React from 'react';

export const ComandaList: React.FC = () => {
  const { comanda } = useComanda();

  const itens = comanda?.itens;

  return (
    <MaxWidthWrapper>
      <div>
        {itens?.map((item) => (
          <div key={item.id}>
            <div>{item.nome}</div>
          </div>
        ))}
      </div>
    </MaxWidthWrapper>
  );
};
