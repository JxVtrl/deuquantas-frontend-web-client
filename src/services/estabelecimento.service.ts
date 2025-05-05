import { api } from '../lib/axios';

export async function getEstabelecimentos() {
    const { data } = await api.get('/estabelecimentos');
    return data;
}


