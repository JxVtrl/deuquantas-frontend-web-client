import React, { useState } from 'react';

const InputQrCode: React.FC = () => {
  const [qrCode, setQrCode] = useState('');

  const handleQrCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQrCode(event.target.value);
  };

  return (
    <div className='flex items-center max-w-[200px] w-full mx-auto bg-[rgba(0, 0, 0, 0.5)]'>
      <input
        type='text'
        placeholder='INSERIR CÓDIGO'
        className='w-full border border-solid outline-none border-white rounded-md p-2 placeholder:text-white placeholder:text-opacity-50 placeholder:text-center placeholder:text-[12px] text-white text-center'
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        value={qrCode}
        onChange={handleQrCodeChange}
      />
    </div>
  );
};

export default InputQrCode;
