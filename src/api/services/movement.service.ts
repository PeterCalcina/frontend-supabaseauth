import { Movement } from '@/shared/types/movement';
import { useAuthFetcher } from '../client/fetcher';
import { API_ENDPOINTS_MOVEMENT } from '../endpoints';
import { EntryMovementDto, ExitMovementDto, ExpirationMovementDto, SaleMovementDto, UpdateMovementDto } from '@/shared/schemas/movement.schema';


export const movementService = () => {
  const fetcher = useAuthFetcher();

  return {
    list: async () => {
      const { data } = await fetcher<Movement[]>(API_ENDPOINTS_MOVEMENT.list);
      return { data };
    },

    listEntriesByExpirationDate: async () => {
      const { data } = await fetcher<Movement[]>(API_ENDPOINTS_MOVEMENT.listEntriesByExpirationDate);
      return { data };
    },

    listEntries: async () => {
      const { data } = await fetcher<Movement[]>(API_ENDPOINTS_MOVEMENT.listEntries);
      return { data };
    },

    get: (id: number) => fetcher<Movement>(API_ENDPOINTS_MOVEMENT.get(id)),

    createEntry: (data: EntryMovementDto) =>
      fetcher<Movement>(API_ENDPOINTS_MOVEMENT.createEntry, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    createSale: (data: SaleMovementDto) =>
      fetcher<Movement>(API_ENDPOINTS_MOVEMENT.createSale, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    createExpiration: (data: ExpirationMovementDto) =>
      fetcher<Movement>(API_ENDPOINTS_MOVEMENT.createExpiration, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    createExit: (data: ExitMovementDto) =>
      fetcher<Movement>(API_ENDPOINTS_MOVEMENT.createExit, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    updateMovement: (id: number, data: UpdateMovementDto) =>
      fetcher<Movement>(API_ENDPOINTS_MOVEMENT.updateMovement(id), {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    deleteMovement: (id: number) =>
      fetcher<Movement>(API_ENDPOINTS_MOVEMENT.deleteMovement(id), {
        method: 'DELETE',
      }),
  };
};
