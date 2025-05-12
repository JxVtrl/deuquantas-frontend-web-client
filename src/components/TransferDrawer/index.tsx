import { useComanda } from '@/contexts/ComandaContext';
import Image from 'next/image';
import { capitalize, currencyFormatter, timeFormatter } from '@/utils/formatters';
import { Button, Drawer, MaxWidthWrapper } from '@deuquantas/components';

export const TransferDrawer = () => {
    const { selectedItem, setSelectedItem } = useComanda();

    if (!selectedItem) {
        return null;
    }

    return (
        <Drawer isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
            <MaxWidthWrapper
                styleContent={{
                    position: 'relative',
                }}
            >
                <button
                    onClick={() => setSelectedItem(null)}
                    className='absolute top-[16px] right-[16px]'
                >
                    <svg
                        width='10'
                        height='10'
                        viewBox='0 0 10 10'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            d='M1.26659 9.66671L0.333252 8.73337L4.06659 5.00004L0.333252 1.26671L1.26659 0.333374L4.99992 4.06671L8.73325 0.333374L9.66659 1.26671L5.93325 5.00004L9.66659 8.73337L8.73325 9.66671L4.99992 5.93337L1.26659 9.66671Z'
                            fill='#272727'
                        />
                    </svg>
                </button>

                <div className='flex flex-col gap-[16px] mb-[81px] py-6'>
                    <div className='flex gap-[8px]'>
                        <Image
                            src={selectedItem.img || '/products/fallback.webp'}
                            alt={selectedItem.nome || ''}
                            width={100}
                            height={100}
                        />
                        <div className='flex flex-col gap-[4px]'>
                            <h1 className='text-[12px] font-[600] leading-[16px] tracking-[0.5px] text-[#000000]'>
                                {capitalize(selectedItem?.nome || '')}
                            </h1>
                            <p className='text-[12px] font-[400] leading-[16px] tracking-[0.5px] text-[#000000]'>
                                Pedido às {timeFormatter(new Date(selectedItem.data_criacao))} | Pedido N° {selectedItem.id}
                            </p>
                            <p className='text-[12px] font-[400] leading-[16px] tracking-[0.5px] text-[#000000]'>
                                Atendido por {'Gomes'}
                            </p>

                            <p className='text-[14px] font-[600] leading-[20px] tracking-[0.5px] text-[#272727]'>
                                {currencyFormatter(selectedItem.preco || 0)}
                            </p>
                        </div>
                    </div>
                    <div className='grid grid-cols-3 gap-[12px]'>
                        <Button variant='primary' text='Transferir item' />
                        <Button variant='primary' text='Dividir item' />
                        <Button variant='underline' text='Não fiz esse pedido' />
                    </div>
                </div>
            </MaxWidthWrapper>
        </Drawer>
    );
};
