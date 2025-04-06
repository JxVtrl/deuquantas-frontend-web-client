import { ProductType } from '@/interfaces/product';
import { api } from '@/lib/axios';

export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

export const addProduct = async (product: ProductType) => {
  const response = await api.post('/api/products', product);
  return response.data;
};

export const editProduct = async (
  id: string,
  updates: {
    name?: string;
    description?: string;
    price?: number;
  },
) => {
  const response = await api.put(`/api/products/${id}`, updates);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  await api.delete(`/api/products/${id}`);
};
