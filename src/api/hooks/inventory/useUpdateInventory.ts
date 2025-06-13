import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/stores/toastStore";
import { inventoryService } from "@/api/services/inventory.service";
import { UpdateInventoryDto } from "@/shared/schemas/inventory.schema";

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const { update: updateInventory } = inventoryService();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInventoryDto }) =>
      await updateInventory(id, data),

    onSuccess: ({ message }) => {
      addToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
    onError: ({ message }) => {
      addToast("error", message);
    },
  });
};
