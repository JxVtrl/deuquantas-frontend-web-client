import { Button, MaxWidthWrapper } from '@deuquantas/components';

export const ComandaPayButton = () => {
  return (
    <MaxWidthWrapper
      style={{
        paddingBottom: '81px',
      }}
    >
      <Button
        variant='primary'
        text='PAGAMENTO'
        style={{
          width: '100%',
          marginTop: '24px',
        }}
      />
    </MaxWidthWrapper>
  );
};
