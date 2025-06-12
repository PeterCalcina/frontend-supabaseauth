import { InventoryItem } from '@/shared/types/inventory';
import { useAuthFetcher } from '../client/fetcher';
import { API_ENDPOINTS } from '../endpoints';


export const inventoryService = () => {
  const fetcher = useAuthFetcher();

  return {
    list: async () => {
      const { data } = await fetcher<InventoryItem[]>(API_ENDPOINTS.inventory.list);
      return { data };
    },

    create: (data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) =>
      fetcher<InventoryItem>(API_ENDPOINTS.inventory.create, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: Partial<InventoryItem>) =>
      fetcher<InventoryItem>(API_ENDPOINTS.inventory.update(id), {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      fetcher<void>(API_ENDPOINTS.inventory.delete(id), {
        method: 'DELETE',
      }),
  };
};
