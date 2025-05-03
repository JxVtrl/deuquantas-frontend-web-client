import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { MaskedInput } from '@/components/ui/masked-input';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { api } from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';

interface CardFormCustomProps {
    valor: number;
    id_comanda: string;
    tipoPagamento: string;
    num_cnpj: string;
    onSuccess?: () => void;
}

export const CardFormCustom: React.FC<CardFormCustomProps> = ({ valor, id_comanda, tipoPagamento, num_cnpj, onSuccess }) => {
    const { user } = useAuth();
    const [form, setForm] = useState({
        cardNumber: '',
        cardholderName: '',
        cardExpiration: '',
        securityCode: '',
        docNumber: '',
        installments: '1',
        paymentMethodId: '',
    });
    const [installmentsOptions, setInstallmentsOptions] = useState<any[]>([]);
    const [paymentMethodName, setPaymentMethodName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Carrega o SDK Mercado Pago
    useEffect(() => {
        if (typeof window !== 'undefined' && window.MercadoPago && !window.mpCustom) {
            window.mpCustom = new window.MercadoPago(PUBLIC_KEY, { locale: 'pt-BR' });
        }
    }, []);

    // Detecta a bandeira e parcelas ao digitar o cartão
    useEffect(() => {
        const bin = form.cardNumber.replace(/\D/g, '').slice(0, 6);
        if (bin.length === 6 && window.mpCustom) {
            window.mpCustom.getPaymentMethods({ bin }).then((res: any) => {
                if (res.results && res.results.length > 0) {
                    setForm((f) => ({ ...f, paymentMethodId: res.results[0].id }));
                    setPaymentMethodName(res.results[0].name);
                }
            });
            window.mpCustom.getInstallments({
                amount: valor,
                bin,
            }).then((res: any) => {
                if (res && res.length > 0) {
                    setInstallmentsOptions(res[0].payer_costs);
                }
            });
        }
    }, [form.cardNumber, valor]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            if (!window.mpCustom) throw new Error('Mercado Pago SDK não carregado');
            const [expMonth, expYear] = form.cardExpiration.split('/');
            const cardData = {
                cardNumber: form.cardNumber.replace(/\D/g, ''),
                cardholderName: form.cardholderName,
                cardExpirationMonth: expMonth,
                cardExpirationYear: expYear,
                securityCode: form.securityCode,
                identificationType: 'CPF',
                identificationNumber: form.docNumber.replace(/\D/g, ''),
            };
            const { id: token } = await window.mpCustom.createCardToken(cardData);
            const payload = {
                token,
                payment_method_id: form.paymentMethodId,
                valor,
                descricao: `Pagamento ${user?.usuario?.name || ''} - ${id_comanda}`,
                id_comanda,
                tipoPagamento,
                num_cnpj,
                installments: Number(form.installments),
            };
            const response = await api.post('/pagamentos/checkout-transparente', payload);
            if (response.data.success || response.data.status === 'approved') {
                setSuccess('Pagamento realizado com sucesso!');
                if (onSuccess) onSuccess();
            } else {
                setError(response.data.message || 'Erro ao processar pagamento');
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao processar pagamento');
        }
        setLoading(false);
    };

    return (
        <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>Pagamento com Cartão</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="cardNumber">Número do cartão</Label>
                        <MaskedInput
                            id="cardNumber"
                            name="cardNumber"
                            maskType="cartao"
                            placeholder="0000 0000 0000 0000"
                            value={form.cardNumber}
                            onChange={handleChange}
                            autoComplete="cc-number"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="cardholderName">Nome impresso no cartão</Label>
                        <Input
                            id="cardholderName"
                            name="cardholderName"
                            placeholder="Como está no cartão"
                            value={form.cardholderName}
                            onChange={handleChange}
                            autoComplete="cc-name"
                            required
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <Label htmlFor="cardExpiration">Validade</Label>
                            <MaskedInput
                                id="cardExpiration"
                                name="cardExpiration"
                                maskType="validade"
                                placeholder="MM/AA"
                                value={form.cardExpiration}
                                onChange={handleChange}
                                autoComplete="cc-exp"
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <Label htmlFor="securityCode">CVV</Label>
                            <MaskedInput
                                id="securityCode"
                                name="securityCode"
                                maskType="cvv"
                                placeholder="CVV"
                                value={form.securityCode}
                                onChange={handleChange}
                                autoComplete="cc-csc"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="docNumber">CPF do titular</Label>
                        <MaskedInput
                            id="docNumber"
                            name="docNumber"
                            maskType="num_cpf"
                            placeholder="000.000.000-00"
                            value={form.docNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="installments">Parcelas</Label>
                        <Select
                            name="installments"
                            value={form.installments}
                            onValueChange={(value) => setForm((f) => ({ ...f, installments: value }))}
                        >
                            <SelectTrigger id="installments">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                {installmentsOptions.map((opt) => (
                                    <SelectItem key={opt.installments} value={String(opt.installments)}>
                                        {opt.recommended_message}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {paymentMethodName && (
                        <div className="text-sm text-gray-500">Bandeira: {paymentMethodName}</div>
                    )}
                    {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                    {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
                    <Button type="submit" className="w-full mt-2" disabled={loading}>
                        {loading ? 'Processando...' : 'Pagar'}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
                <div className="text-xs text-muted-foreground">Seus dados estão seguros e não são armazenados.</div>
            </CardFooter>
            <Script src="https://sdk.mercadopago.com/js/v2" strategy="beforeInteractive" />
        </Card>
    );
}; 