import { Movement } from '@/shared/types/movement';
import { useAuthFetcher } from '../client/fetcher';
import { API_ENDPOINTS_MOVEMENT } from '../endpoints';
import { EntryMovementDto } from '@/shared/schemas/movement.schema';


export const movementService = () => {
  const fetcher = useAuthFetcher();

  return {
    list: async () => {
      const { data } = await fetcher<Movement[]>(API_ENDPOINTS_MOVEMENT.list);
      return { data };
    },

    get: (id: number) => fetcher<Movement>(API_ENDPOINTS_MOVEMENT.get(id)),

    createEntry: (data: EntryMovementDto) =>
      fetcher<Movement>(API_ENDPOINTS_MOVEMENT.createEntry, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    createSale: (data: Omit<Movement, 'id' | 'createdAt' | 'updatedAt'>) =>
      fetcher<Movement>(API_ENDPOINTS_MOVEMENT.createSale, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    createExpiration: (data: Omit<Movement, 'id' | 'createdAt' | 'updatedAt'>) =>
      fetcher<Movement>(API_ENDPOINTS_MOVEMENT.createExpiration, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    createExit: (data: Omit<Movement, 'id' | 'createdAt' | 'updatedAt'>) =>
      fetcher<Movement>(API_ENDPOINTS_MOVEMENT.createExit, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  };
};
