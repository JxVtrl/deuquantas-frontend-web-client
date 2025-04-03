export const purchase_history_mock = [
  // HOJE
  {
    id: '0',
    date: new Date().toISOString(),
    establishment: {
      name: "Habbib's",
    },
    total: 50,
  },
  {
    id: '1',
    date: new Date().toISOString(),
    establishment: {
      name: "Bob's",
    },
    total: 150,
  },
  // ONTEM
  {
    id: '2',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    establishment: {
      name: "McDonald's",
    },
    total: 100,
  },
  // ANTEONTEM
  {
    id: '3',
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    establishment: {
      name: 'Burger King',
    },
    total: 200,
  },
  // 3 DIAS ATRÁS OU MAIS ATÉ 1 ANO ATRÁS
  {
    id: '4',
    date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    establishment: {
      name: 'KFC',
    },
    total: 300,
  },
  // ACIMA DE 1 ANO ATRÁS
  {
    id: '5',
    date: new Date(
      new Date().setFullYear(new Date().getFullYear() - 1),
    ).toISOString(),
    establishment: {
      name: 'Pizza Hut',
    },
    total: 400,
  },
];
