export const timeFormatter = (value: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(value));
};

export const currencyFormatter = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const capitalize = (value: string) => {
  const words = value.split(' ');
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(' ');
};
