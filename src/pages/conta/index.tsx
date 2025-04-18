import React from 'react';
import { withAuthCustomer } from '@/hoc/withAuth';
import Layout from '@/layout';
import { UserPreferences } from '@/components/UserPreferences';
import { MaxWidthWrapper } from '@deuquantas/components';

// import { Container } from './styles';

const Conta: React.FC = () => {
  return (
    <Layout>
      <MaxWidthWrapper>
        <div className='py-6'>
          <h1 className='text-2xl font-bold mb-6'>Minha Conta</h1>
          <div className='space-y-6'>
            <UserPreferences />
            {/* Outros componentes de configuração podem ser adicionados aqui */}
          </div>
        </div>
      </MaxWidthWrapper>
    </Layout>
  );
};

export default withAuthCustomer(Conta);
