import useDebounce from "@/hooks/useDebounce";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { ModalType } from "@/types/types";
import { onError, onSuccess } from "@/utils/toast";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteProduct, getProducts } from "../api/product.service";
import { IProduct } from "../types/product.types";

export const useProducts = () => {
  const isAdmin = useIsAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const pageIndex = page - 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || "";
  const debouncedSearch = useDebounce(search, 1000);

  const { data, isLoading } = useQuery({
    queryKey: ["products", pageIndex, pageSize, debouncedSearch],
    queryFn: () =>
      getProducts({
        limit: pageSize,
        offset: pageIndex * pageSize,
        search: debouncedSearch,
      }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess("Product deleted successfully");
      handleClose();
    },
    onError: (err) => {
      onError(err, "Failed to delete product");
    },
  });

  const products = data?.data ?? [];
  const totalCount = data?.total ?? 0;

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
    setModalType("add");
  };

  const handleOpenEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setModalType("edit");
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setModalType(null);
  };

  const handleConfirmationModal = (id: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setSelectedProduct(product);
      setModalType("delete");
      setIsModalOpen(true);
    }
  };

  const handleDeleteConfirm = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handlePageChange = (newPageIndex: number) => {
    setSearchParams((prev) => {
      const newPage = newPageIndex + 1;
      if (newPage <= 1) {
        prev.delete("page");
      } else {
        prev.set("page", String(newPage));
      }
      return prev;
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSearchParams((prev) => {
      prev.set("pageSize", String(newPageSize));
      prev.delete("page");
      return prev;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams((prev) => {
      prev.set("search", e.target.value);
      return prev;
    });
  };

  return {
    products,
    totalCount,
    isLoading,
    isAdmin,
    isModalOpen,
    modalType,
    selectedProduct,
    search,
    pageIndex,
    pageSize,
    handleOpenAdd,
    handleOpenEdit,
    handleClose,
    handleConfirmationModal,
    handleDeleteConfirm,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
  };
};
