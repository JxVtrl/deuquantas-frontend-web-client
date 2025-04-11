import { MaxWidthLayout } from '@/layout';
import React from 'react';
import { Button } from '../ui/button';

// import { Container } from './styles';

const ComandaButtons: React.FC = () => {
  return (
    <MaxWidthLayout>
      <div className='flex justify-between items-center'>
        <Button>Voltar</Button>
      </div>
    </MaxWidthLayout>
  );
};

export default ComandaButtons;
