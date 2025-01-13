import type { NextApiRequest, NextApiResponse } from 'next';
import { products } from './data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Retorna todos os produtos
    res.status(200).json(products);
  } else if (req.method === 'POST') {
    // Adiciona um novo produto
    const { name, description, price } = req.body;
    if (!name || !price) {
      res.status(400).json({ message: 'Name and price are required' });
      return;
    }

    const newProduct = {
      id: String(Date.now()),
      name,
      description,
      price,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } else {
    // Método não suportado
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
