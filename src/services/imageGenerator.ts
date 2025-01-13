export const generateImage = async (prompt: string) => {
  const response = await fetch('/api/generateImage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Erro ao gerar a imagem');
  }

  const data = await response.json();
  return data.imageUrl;
};
