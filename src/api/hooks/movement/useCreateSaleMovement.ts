import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/stores/toastStore";
import { movementService } from "@/api/services/movement.service";
import { SaleMovementDto } from "@/shared/schemas/movement.schema";

export const useCreateSaleMovement = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { createSale: createSaleMovement } = movementService();

  return useMutation({
    mutationFn: async (
      data: SaleMovementDto
    ) =>
      await createSaleMovement(data),

    onSuccess: ({ message }) => {
      addToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["movements"] });
    },
    onError: ({ message }) => {
      addToast("error", message);
    },
  });
};
