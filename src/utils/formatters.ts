export const timeFormatter = (value: Date | string) => {
  try {
    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  } catch {
    return 'Data inválida';
  }
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
