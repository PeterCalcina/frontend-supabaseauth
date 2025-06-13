const BASE_URL = import.meta.env.VITE_API_URL;
const PREFIX = 'api';
const INVENTORY_URL = `${BASE_URL}/${PREFIX}/inventory`;
const MOVEMENT_URL = `${BASE_URL}/${PREFIX}/movements`;

export const API_ENDPOINTS_INVENTORY = {
  inventory: {
    list: `${INVENTORY_URL}`,
    create: `${INVENTORY_URL}`,
    get: (id: number) => `${INVENTORY_URL}/${id}`,
    update: (id: number) => `${INVENTORY_URL}/${id}`,
    delete: (id: number) => `${INVENTORY_URL}/${id}`,
  },
};

export const API_ENDPOINTS_MOVEMENT = {
  list: `${MOVEMENT_URL}`,
  listEntriesByExpirationDate: `${MOVEMENT_URL}/entries-by-expiration-date`,
  listEntries: `${MOVEMENT_URL}/entries`,
  get: (id: number) => `${MOVEMENT_URL}/${id}`,
  createEntry: `${MOVEMENT_URL}`,
  createSale: `${MOVEMENT_URL}`,
  createExpiration: `${MOVEMENT_URL}`,
  createExit: `${MOVEMENT_URL}`,
};
