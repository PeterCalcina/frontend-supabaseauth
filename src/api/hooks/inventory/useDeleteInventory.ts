import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../../services/inventory.service";
import { useToastStore } from "@/stores/toastStore";

export const useDeleteInventory = () => {
  const { delete: deleteInventory } = inventoryService();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: async (id: string) => {
      const { message } = await deleteInventory(id);
      return { message };
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      addToast("success", message);
    },
    onError: ({ message }) => {
      addToast("error", message);
    },
  });
};