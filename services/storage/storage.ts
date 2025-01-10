const defaultStorage = localStorage;

const clearWithException = (exceptionKeys: string[]) => {
  for (let i = 0; i < defaultStorage.length; i++) {
    const key = defaultStorage.key(i) || "";

    // Key is not in the exception keys array
    if (!(exceptionKeys.indexOf(key) > -1)) {
      defaultStorage.removeItem(key);
    }
  }
};

const storage = {
  clear: () => defaultStorage.clear(),
  clearWithException: (keys: string[]) => clearWithException(keys),
  getItem: (key: string) => defaultStorage.getItem(key),
  key: (index: number) => defaultStorage.key(index),
  removeItem: (key: string) => defaultStorage.removeItem(key),
  setItem: (key: string, value: string) => defaultStorage.setItem(key, value),
};

export default storage;
