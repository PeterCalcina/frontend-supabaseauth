import { useQuery } from '@tanstack/react-query';
import { movementService } from '../../services/movement.service';
import { MovementType } from '@/shared/enum/movement-type.enum';

export const useListEntriesMovements = () => {
  const { listEntries } = movementService();

  return useQuery({
    queryKey: ['movements', MovementType.ENTRY, 'with-expiration-date-null'],
    queryFn: listEntries,
  });
}; 