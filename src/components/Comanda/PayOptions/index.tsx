import { Button } from '@deuquantas/components';
import { MaxWidthWrapper } from '@deuquantas/components';
import React from 'react';

export const ComandaPayOptions: React.FC = () => {
  return (
    <MaxWidthWrapper
      style={{
        paddingBottom: '110px',
      }}
    >
      <Button
        variant='primary'
        text='OPÇÕES DE PAGAMENTO'
        style={{
          width: '100%',
          marginTop: '32px',
        }}
      />
    </MaxWidthWrapper>
  );
};
