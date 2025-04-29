import React, { useState, useEffect } from 'react';

interface InputCodigoMesaProps {
  onCodigoCompleto: (codigo: string) => void;
}

export const InputCodigoMesa: React.FC<InputCodigoMesaProps> = ({
  onCodigoCompleto,
}) => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Limpa o erro quando o código mudar
    setError(null);
  }, [codigo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setCodigo(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigo) {
      setError('Digite o código da mesa');
      return;
    }

    if (codigo.length < 6) {
      setError('Código inválido');
      return;
    }

    onCodigoCompleto(codigo);
  };

  return (
    <form onSubmit={handleSubmit} className='w-full'>
      <div className='flex flex-col gap-2'>
        <input
          type='text'
          value={codigo}
          onChange={handleChange}
          placeholder='Digite o código da mesa'
          maxLength={8}
        />
        {error && <p className='text-sm text-red-500'>{error}</p>}
        <button
          type='submit'
          className='w-full bg-[#FFCC00] text-black py-2 px-4 rounded hover:bg-[#FFCC00]/80 transition-colors'
        >
          Buscar Mesa
        </button>
      </div>
    </form>
  );
};
