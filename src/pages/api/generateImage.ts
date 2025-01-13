import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const secretKey = process.env.IMAGE_API_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({ error: 'API Secret Key não configurada' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: req.body.prompt,
        n: 1,
        size: '512x512',
      },
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    res.status(200).json({ imageUrl: response.data.data[0].url });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Erro ao gerar imagem', details: error.message });
    } else {
      res.status(500).json({ error: 'Erro ao gerar imagem', details: 'Unknown error' });
    }
  }
}
