import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { useComanda } from '@/contexts/ComandaContext';
import { Item } from '@/services/menu.service';
import { Avatar, Button } from '@deuquantas/components';
import React from 'react';

const TransferConfirmacaoModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    clienteId: string;
    item: Item;
}> = ({ isOpen, onClose, onConfirm, clienteId, item }) => {
    const { clientes } = useComanda();

    // Verifica se o cliente selecionado existe na lista de clientes
    const cliente = clientes.find((cliente) => cliente.id === clienteId);


    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <div className='flex items-center justify-between w-[124px] mx-auto'>
                    <Avatar size={38} name={cliente?.nome || `dQ`} />
                    <svg
                        width='17'
                        height='16'
                        viewBox='0 0 17 16'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            d='M12.675 7L7.075 1.4L8.5 -6.99382e-07L16.5 8L8.5 16L7.075 14.6L12.675 9L0.500001 9L0.500001 7L12.675 7Z'
                            fill='#1D1B20'
                        />
                    </svg>
                    <Avatar size={38} name='???' />
                </div>

                <p className='text-[16px] font-[500] text-[#000000] leading-[16px]'>
                    Confirmar a transferência do item <b>{item?.nome}</b>?
                    <br />
                    <br />
                    {cliente?.nome} deverá aceitar sua solicitação de transferência para finalizar o procedimento.
                </p>
                <div className='flex flex-col justify-end gap-2'>
                    <Button
                        variant='tertiary'
                        onClick={onConfirm}
                        text={`De acordo, excluir.`}
                    />
                    <Button variant='secondary' onClick={onClose} text={`Cancelar`} />
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default TransferConfirmacaoModal;
