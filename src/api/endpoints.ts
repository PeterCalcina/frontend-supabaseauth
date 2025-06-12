const BASE_URL = import.meta.env.VITE_API_URL;
const PREFIX = `${BASE_URL}/api`;
export const API_ENDPOINTS = {
  inventory: {
    list: `${PREFIX}/inventory`,
    create: `${PREFIX}/inventory`,
    get: (id: string) => `${PREFIX}/inventory/${id}`,
    update: (id: string) => `${PREFIX}/inventory/${id}`,
    delete: (id: string) => `${PREFIX}/inventory/${id}`,
  },
};
