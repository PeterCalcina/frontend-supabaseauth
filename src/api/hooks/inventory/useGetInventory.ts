import { useQuery } from '@tanstack/react-query';
import { inventoryService } from '../../services/inventory.service';

export const useGetInventory = (id: number) => {
  const { get } = inventoryService();

  return useQuery({
    queryKey: ['inventories', id],
    queryFn: () => get(id),
  });
};
