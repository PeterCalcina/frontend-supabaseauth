import { useQuery } from '@tanstack/react-query';
import { movementService } from '../../services/movement.service';
import { MovementType } from '@/shared/enum/movement-type.enum';

export const useListEntriesByExpirationDateMovements = () => {
  const { listEntriesByExpirationDate } = movementService();

  return useQuery({
    queryKey: ['movements', MovementType.ENTRY, 'expiration'],
    queryFn: listEntriesByExpirationDate,
  });
}; 