import { useQuery } from '@tanstack/react-query';
import { inventoryService } from '../../services/inventory.service';

export const useListInventory = () => {
  const { list } = inventoryService();

  return useQuery({
    queryKey: ['inventories'],
    queryFn: list,
  });
};
