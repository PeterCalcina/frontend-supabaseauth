import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/stores/toastStore";
import { movementService } from "@/api/services/movement.service";

export const useDeleteMovement = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { deleteMovement } = movementService();

  return useMutation({
    mutationFn: async (id: string) => await deleteMovement(Number(id)),

    onSuccess: ({ message }) => {
      addToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["movements"] });
    },
    onError: ({ message }) => {
      addToast("error", message);
    },
  });
}; 