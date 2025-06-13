import { InventoryItem } from '@/shared/types/inventory';
import { useAuthFetcher } from '../client/fetcher';
import { API_ENDPOINTS_INVENTORY } from '../endpoints';
import { CreateInventoryDto, UpdateInventoryDto } from '@/shared/schemas/inventory.schema';


export const inventoryService = () => {
  const fetcher = useAuthFetcher();

  return {
    list: async () => {
      const { data } = await fetcher<InventoryItem[]>(API_ENDPOINTS_INVENTORY.inventory.list);
      return { data };
    },

    get: (id: number) => fetcher<InventoryItem>(API_ENDPOINTS_INVENTORY.inventory.get(id)),

    create: (data: CreateInventoryDto) =>
      fetcher<InventoryItem>(API_ENDPOINTS_INVENTORY.inventory.create, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: number, data: UpdateInventoryDto) =>
      fetcher<InventoryItem>(API_ENDPOINTS_INVENTORY.inventory.update(id), {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: number) =>
      fetcher<void>(API_ENDPOINTS_INVENTORY.inventory.delete(id), {
        method: 'DELETE',
      }),
  };
};
