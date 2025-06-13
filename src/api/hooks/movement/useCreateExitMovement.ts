import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/stores/toastStore";
import { movementService } from "@/api/services/movement.service";
import { ExitMovementDto } from "@/shared/schemas/movement.schema";

export const useCreateExitMovement = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { createExit: createExitMovement } = movementService();

  return useMutation({
    mutationFn: async (data: ExitMovementDto) =>
      await createExitMovement(data),

    onSuccess: ({ message }) => {
      addToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["movements"] });
    },
    onError: ({ message }) => {
      addToast("error", message);
    },
  });
};
