import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/stores/toastStore";
import { movementService } from "@/api/services/movement.service";
import { Movement } from "@/shared/types/movement";

export const useCreateEntryMovement = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { createEntry: createEntryMovement } = movementService();

  return useMutation({
    mutationFn: async (
      data: Omit<Movement, "id" | "createdAt" | "updatedAt">
    ) =>
      await createEntryMovement(data),

    onSuccess: ({ message }) => {
      addToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["movements"] });
    },
    onError: ({ message }) => {
      addToast("error", message);
    },
  });
};
