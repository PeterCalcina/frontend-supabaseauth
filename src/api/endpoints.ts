const BASE_URL = import.meta.env.VITE_API_URL;
const PREFIX = `${BASE_URL}/api`;
export const API_ENDPOINTS_INVENTORY = {
  inventory: {
    list: `${PREFIX}/inventory`,
    create: `${PREFIX}/inventory`,
    get: (id: string) => `${PREFIX}/inventory/${id}`,
    update: (id: string) => `${PREFIX}/inventory/${id}`,
    delete: (id: string) => `${PREFIX}/inventory/${id}`,
  },
};

export const API_ENDPOINTS_MOVEMENT = {
  list: `${PREFIX}/movement`,
  get: (id: string) => `${PREFIX}/movement/${id}`,
  createEntry: `${PREFIX}/movement/entry`,
  createSale: `${PREFIX}/movement/sale`,
  createExpiration: `${PREFIX}/movement/expiration`,
  createExit: `${PREFIX}/movement/exit`,
};
