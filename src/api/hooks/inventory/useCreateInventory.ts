import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/stores/toastStore";
import { inventoryService } from "../../services/inventory.service";
import { CreateInventoryDto } from "@/shared/schemas/inventory.schema";

export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { create: createInventory } = inventoryService();

  return useMutation({
    mutationFn: async (
      data: CreateInventoryDto
    ) =>
      await createInventory(data),

    onSuccess: ({ message }) => {
      addToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
    onError: ({ message }) => {
      addToast("error", message);
    },
  });
};
