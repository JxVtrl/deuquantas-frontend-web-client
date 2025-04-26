import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useComanda } from '@/contexts/ComandaContext';
import { MaxWidthWrapper, ReceiptIcon } from '@deuquantas/components';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { currencyFormatter } from '@/utils/formatters';

export const OpenComandas: React.FC = () => {
    const { user } = useAuth();
    const { fetchComandaAtiva, comanda } = useComanda();
    const router = useRouter();

    const checkComandaAtiva = async () => {
        await fetchComandaAtiva();
    };

    useEffect(() => {
        checkComandaAtiva();
    }, []);

    const handleCardClick = () => {
        if (comanda) {
            router.push(`/conta/comanda`);
        }
    };

    return <MaxWidthWrapper style={{
        padding: '0 0 110px',
    }}>
        {comanda ? (
            <Card
                className="p-4 cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98] bg-white"
                onClick={handleCardClick}
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#F5F5F5] rounded-full">
                            <ReceiptIcon />
                        </div>
                        <div>
                            <h2 className="text-[16px] font-[600] text-[#272727] leading-[24px]">
                                Comanda {comanda.id}
                            </h2>
                            <p className="text-[14px] font-[400] text-[#666666] leading-[20px]">
                                Mesa {comanda.numMesa}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[14px] font-[600] text-[#272727] leading-[20px]">
                            {currencyFormatter(comanda.conta?.valTotal || 0)}
                        </p>
                        <p className="text-[12px] font-[400] text-[#666666] leading-[16px]">
                            {comanda.itens.length} {comanda.itens.length === 1 ? 'item' : 'itens'}
                        </p>
                    </div>
                </div>
            </Card>
        ) : (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
            }}>
                <h2 className='text-[16px] font-[500] text-black leading-[24px]'>
                    Seja Bem-vindo, <strong>{user?.usuario.name}</strong>
                </h2>
                <span className='text-[14px] font-[500] text-black leading-[24px]'>
                    Você ainda não está listado em nenhum estabelecimento.
                </span>
            </div>
        )}
    </MaxWidthWrapper>;
};
