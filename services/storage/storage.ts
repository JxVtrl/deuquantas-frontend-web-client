// Verificar se o ambiente é o navegador
const isBrowser = typeof window !== "undefined";

// Encapsular o acesso ao localStorage
const defaultStorage = isBrowser ? localStorage : null;

const clearWithException = (exceptionKeys: string[]) => {
  if (!defaultStorage) return;

  for (let i = 0; i < defaultStorage.length; i++) {
    const key = defaultStorage.key(i) || "";

    // Key is not na lista de exceções
    if (!(exceptionKeys.indexOf(key) > -1)) {
      defaultStorage.removeItem(key);
    }
  }
};

const storage = {
  clear: () => {
    if (defaultStorage) defaultStorage.clear();
  },
  clearWithException: (keys: string[]) => clearWithException(keys),
  getItem: (key: string) => (defaultStorage ? defaultStorage.getItem(key) : null),
  key: (index: number) => (defaultStorage ? defaultStorage.key(index) : null),
  removeItem: (key: string) => {
    if (defaultStorage) defaultStorage.removeItem(key);
  },
  setItem: (key: string, value: string) => {
    if (defaultStorage) defaultStorage.setItem(key, value);
  },
};

export default storage;
