import { ProductType } from '@/interfaces/product';
import axios from './axios';

export const getProducts = async () => {
  const response = await axios.get('/api/products');
  return response.data;
};

export const addProduct = async (product: ProductType) => {
  const response = await axios.post('/api/products', product);
  return response.data;
};

export const editProduct = async (id: string, updates: {
  name?: string;
  description?: string;
  price?: number;
}) => {
  const response = await axios.put(`/api/products/${id}`, updates);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  await axios.delete(`/api/products/${id}`);
};
