import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthFetcher } from "../client/fetcher";
import { API_ENDPOINTS } from "../endpoints";
import { InventoryItem } from "@/shared/types/inventory";
import { useToastStore } from "@/stores/toastStore";

export const useCreateInventory = () => {
  const fetcher = useAuthFetcher();
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();

  return useMutation({
    mutationFn: async (
      data: Omit<InventoryItem, "id" | "createdAt" | "updatedAt">
    ) =>
      await fetcher<InventoryItem>(API_ENDPOINTS.inventory.create, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    onSuccess: ({ message }) => {
      addToast("success", message);
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
    onError: ({ message }) => {
      addToast("error", message);
    },
  });
};
