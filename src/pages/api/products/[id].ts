import type { NextApiRequest, NextApiResponse } from 'next';
import { products } from './data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    // Retorna um único produto
    const product = products.find((p) => p.id === id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.status(200).json(product);
  } else if (req.method === 'PUT') {
    // Atualiza um produto
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const { name, description, price } = req.body;
    products[index] = { ...products[index], name, description, price };
    res.status(200).json(products[index]);
  } else if (req.method === 'DELETE') {
    // Remove um produto
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    products.splice(index, 1);
    res.status(204).end();
  } else {
    // Método não suportado
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
