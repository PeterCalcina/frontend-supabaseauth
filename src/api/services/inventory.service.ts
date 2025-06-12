import { InventoryItem } from '@/shared/types/inventory';
import { useAuthFetcher } from '../client/fetcher';
import { API_ENDPOINTS } from '../endpoints';
import { useToastStore } from '@/stores/toastStore';


export const inventoryService = () => {
  const fetcher = useAuthFetcher();
  const { addToast } = useToastStore();

  return {
    list: async () => {
      const { data, message } = await fetcher<InventoryItem[]>(API_ENDPOINTS.inventory.list);
      addToast("info", message);
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
