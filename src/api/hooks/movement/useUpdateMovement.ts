import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/stores/toastStore";
import { movementService } from "@/api/services/movement.service";
import { UpdateMovementDto } from "@/shared/schemas/movement.schema";

export const useUpdateMovement = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { updateMovement } = movementService();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & UpdateMovementDto) =>
      await updateMovement(Number(id), data),

    onSuccess: ({ message }) => {
      addToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["movements"] });
    },
    onError: ({ message }) => {
      addToast("error", message);
    },
  });
}; 