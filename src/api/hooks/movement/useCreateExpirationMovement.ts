import { ExpirationMovementDto } from './../../../shared/schemas/movement.schema';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/stores/toastStore";
import { movementService } from "@/api/services/movement.service";

export const useCreateExpirationMovement = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { createExpiration: createExpirationMovement } = movementService();

  return useMutation({
    mutationFn: async (data: ExpirationMovementDto) =>
      await createExpirationMovement(data),

    onSuccess: ({ message }) => { 
      addToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["movements"] });
    },
    onError: ({ message }) => {
      addToast("error", message);
    },
  });
};
