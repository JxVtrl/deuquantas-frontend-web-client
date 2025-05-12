import React, { useState } from 'react';
import {
  Button,
  Drawer,
  MaxWidthWrapper,
  Avatar,
} from '@deuquantas/components';
import { useComanda } from '@/contexts/ComandaContext';
import { toast } from 'react-hot-toast';
import ComandaService from '@/services/comanda.service';
import { motion } from 'framer-motion';

interface ExcluirPessoaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  options: { value: string; label: string }[];
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  criadorId: string;
}

export const ExcluirPessoaModal: React.FC<ExcluirPessoaModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  options,
  selectedOption,
  setSelectedOption,
  criadorId,
}) => {
  const { clientes } = useComanda();

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <MaxWidthWrapper>
        <div
          className={
            'flex flex-col gap-[24px] py-6 transition-all duration-300'
          }
          style={{
            paddingBottom: selectedOption ? '81px' : '0px',
          }}
        >
          <div className='flex flex-row items-center gap-[8px]'>
            <p className='text-[14px] font-[500] leading-[20px] tracking-[0.1px] text-[#272727]'>
              Excluir:
            </p>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className='w-full p-0 border rounded h-[24px] text-[14px] font-[400] leading-[20px] tracking-[0.5px] text-[#272727] px-[8px] bg-[#FFFFFF] border-[#D9D9D9]'
            >
              <option
                value=''
                className='text-[12px] font-[400] leading-[12px] tracking-[0] text-[#272727]'
              >
                Selecione uma pessoa
              </option>
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className='text-[12px] font-[400] leading-[12px] tracking-[0] text-[#272727]'
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-row gap-[16px]'>
            {clientes.map((cliente) => {
              const isOwner = cliente.id === criadorId;

              if (isOwner) {
                return null;
              }

              const bgColor =
                selectedOption === cliente.id
                  ? '#FFCC00'
                  : cliente.status === 'pago'
                    ? 'rgb(21, 128, 61)'
                    : '#F0F0F0';

              return (
                <div
                  key={cliente.id}
                  className='flex items-center cursor-pointer'
                  onClick={() => {
                    if (selectedOption === cliente.id) {
                      setSelectedOption('');
                    } else {
                      setSelectedOption(cliente.id);
                    }
                  }}
                >
                  <Avatar
                    key={cliente.id}
                    name={cliente.nome}
                    bgColor={bgColor}
                  />
                </div>
              );
            })}
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity:
                selectedOption &&
                options.find((option) => option.value === selectedOption)
                  ? 1
                  : 0,
              y:
                selectedOption &&
                options.find((option) => option.value === selectedOption)
                  ? 0
                  : 50,
            }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className='flex flex-col gap-[8px]'
          >
            <p className='text-[14px] font-[500] leading-[20px] tracking-[0.1px] text-[#272727]'>
              Excluir{' '}
              {options.find((option) => option.value === selectedOption)?.label}
              ?
            </p>
            <div className='grid grid-cols-2 items-center justify-between gap-[8px]'>
              <Button
                type='submit'
                variant='tertiary'
                text='Excluir'
                onClick={onConfirm}
              />
              <Button variant='underline' text='Cancelar' onClick={onClose} />
            </div>
          </motion.div>
        </div>
      </MaxWidthWrapper>
    </Drawer>
  );
};
