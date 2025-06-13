import { useQuery } from '@tanstack/react-query';
import { movementService } from '../../services/movement.service';

export const useListMovements = () => {
  const { list } = movementService();

  return useQuery({
    queryKey: ['movements'],
    queryFn: list,
  });
}; 