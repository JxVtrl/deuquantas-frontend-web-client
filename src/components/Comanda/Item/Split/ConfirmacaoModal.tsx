import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';
import { useComanda } from '@/contexts/ComandaContext';
import { Item } from '@/services/menu.service';
import { Avatar, Button } from '@deuquantas/components';
import React from 'react';

const SplitConfirmacaoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientesIds: string[] | string;
  item: Item;
}> = ({ isOpen, onClose, onConfirm, clientesIds, item }) => {
  const { clientes } = useComanda();

  const origemCliente = clientes.find((cliente) => cliente.id === item.cliente?.id);

  const nameOfAllClientesFromClientesIds = clientes.filter((cliente) =>
    clientesIds.includes(cliente.id),
  ).map((cliente) => cliente.nome).filter((cliente) => cliente !== origemCliente?.nome);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <div className='flex items-center justify-between w-[124px] mx-auto'>
          <Avatar size={38} name={origemCliente?.nome || ''} />
          <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 19.1666C13.2361 19.1666 12.5868 18.8992 12.0521 18.3645C11.5174 17.8298 11.25 17.1805 11.25 16.4166C11.25 16.3096 11.2576 16.1989 11.2729 16.0843C11.2882 15.9697 11.3111 15.8666 11.3417 15.7749L4.87917 12.0166C4.61944 12.2458 4.32917 12.4253 4.00833 12.5551C3.6875 12.685 3.35139 12.7499 3 12.7499C2.23611 12.7499 1.58681 12.4826 1.05208 11.9478C0.517361 11.4131 0.25 10.7638 0.25 9.99992C0.25 9.23603 0.517361 8.58672 1.05208 8.052C1.58681 7.51728 2.23611 7.24992 3 7.24992C3.35139 7.24992 3.6875 7.31485 4.00833 7.44471C4.32917 7.57457 4.61944 7.75409 4.87917 7.98325L11.3417 4.22492C11.3111 4.13325 11.2882 4.03013 11.2729 3.91554C11.2576 3.80096 11.25 3.6902 11.25 3.58325C11.25 2.81936 11.5174 2.17006 12.0521 1.63534C12.5868 1.10061 13.2361 0.833252 14 0.833252C14.7639 0.833252 15.4132 1.10061 15.9479 1.63534C16.4826 2.17006 16.75 2.81936 16.75 3.58325C16.75 4.34714 16.4826 4.99645 15.9479 5.53117C15.4132 6.06589 14.7639 6.33325 14 6.33325C13.6486 6.33325 13.3125 6.26832 12.9917 6.13846C12.6708 6.0086 12.3806 5.82909 12.1208 5.59992L5.65833 9.35825C5.68889 9.44992 5.71181 9.55304 5.72708 9.66763C5.74236 9.78221 5.75 9.89297 5.75 9.99992C5.75 10.1069 5.74236 10.2176 5.72708 10.3322C5.71181 10.4468 5.68889 10.5499 5.65833 10.6416L12.1208 14.3999C12.3806 14.1708 12.6708 13.9912 12.9917 13.8614C13.3125 13.7315 13.6486 13.6666 14 13.6666C14.7639 13.6666 15.4132 13.9339 15.9479 14.4687C16.4826 15.0034 16.75 15.6527 16.75 16.4166C16.75 17.1805 16.4826 17.8298 15.9479 18.3645C15.4132 18.8992 14.7639 19.1666 14 19.1666ZM14 4.49992C14.2597 4.49992 14.4774 4.41207 14.6531 4.23638C14.8288 4.06068 14.9167 3.84297 14.9167 3.58325C14.9167 3.32353 14.8288 3.10582 14.6531 2.93013C14.4774 2.75443 14.2597 2.66659 14 2.66659C13.7403 2.66659 13.5226 2.75443 13.3469 2.93013C13.1712 3.10582 13.0833 3.32353 13.0833 3.58325C13.0833 3.84297 13.1712 4.06068 13.3469 4.23638C13.5226 4.41207 13.7403 4.49992 14 4.49992ZM3 10.9166C3.25972 10.9166 3.47743 10.8287 3.65313 10.653C3.82882 10.4773 3.91667 10.2596 3.91667 9.99992C3.91667 9.7402 3.82882 9.52249 3.65313 9.34679C3.47743 9.1711 3.25972 9.08325 3 9.08325C2.74028 9.08325 2.52257 9.1711 2.34688 9.34679C2.17118 9.52249 2.08333 9.7402 2.08333 9.99992C2.08333 10.2596 2.17118 10.4773 2.34688 10.653C2.52257 10.8287 2.74028 10.9166 3 10.9166ZM14 17.3333C14.2597 17.3333 14.4774 17.2454 14.6531 17.0697C14.8288 16.894 14.9167 16.6763 14.9167 16.4166C14.9167 16.1569 14.8288 15.9392 14.6531 15.7635C14.4774 15.5878 14.2597 15.4999 14 15.4999C13.7403 15.4999 13.5226 15.5878 13.3469 15.7635C13.1712 15.9392 13.0833 16.1569 13.0833 16.4166C13.0833 16.6763 13.1712 16.894 13.3469 17.0697C13.5226 17.2454 13.7403 17.3333 14 17.3333Z" fill="#272727" />
          </svg>
          {nameOfAllClientesFromClientesIds.map((cliente) => (
            <Avatar size={38} name={cliente} />
          ))}
        </div>

        <p className='text-[16px] font-[500] text-[#000000] leading-[16px]'>
          Confirmar a divisão do item <b>{item?.nome}</b>?
          <br />
          <br />
          {nameOfAllClientesFromClientesIds.join(', ')} deverão aceitar sua solicitação de divisão para finalizar o procedimento.
        </p>
        <div className='flex flex-col justify-end gap-2'>
          <Button
            variant='tertiary'
            onClick={onConfirm}
            text={
              'De acordo, dividir.'
            }
          />
          <Button variant='secondary' onClick={onClose} text={`Cancelar`} />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SplitConfirmacaoModal;
