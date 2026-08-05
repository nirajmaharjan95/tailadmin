import useDebounce from "@/hooks/useDebounce";
import { ModalType } from "@/types/types";
import { onError, onSuccess } from "@/utils/toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteCourse, getCourses } from "../api/course.service";
import { ICourse } from "../types/course.types";

export const useCourses = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalType, setModalType] = useState<ModalType>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);

  const page = Number(searchParams.get("page")) || 1;
  const pageIndex = page - 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const sort = searchParams.get("sort") || undefined;
  const search = searchParams.get("search") || "";
  const debouncedSearch = useDebounce(search, 1000);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const result = await getCourses({
          limit: pageSize,
          offset: pageIndex * pageSize,
          search: debouncedSearch,
          sort,
        });
        setCourses(result.data);
        setTotalCount(result.total);
      } catch (error) {
        onError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [pageSize, pageIndex, debouncedSearch, refreshTrigger, sort]);

  const handlePageChange = (newPageIndex: number) => {
    setSearchParams(prev => {
      prev.set("page", (newPageIndex + 1).toString());
      return prev;
    });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSearchParams(prev => {
      prev.set("pageSize", newPageSize.toString());
      prev.set("page", "1");
      return prev;
    });
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCourse?.id) return;
    try {
      setIsLoading(true);
      await deleteCourse(selectedCourse.id);
      onSuccess("Course deleted successfully");
      setSelectedCourse(null);
      const result = await getCourses({
        limit: pageSize,
        offset: pageIndex * pageSize,
        search: debouncedSearch,
      });
      setCourses(result.data);
      setTotalCount(result.total);
    } catch (error) {
      onError(error, "Failed to delete course");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => {
      const value = e.target.value;
      prev.set("search", value);
      prev.delete("page");
      return prev;
    });
  };

  const onEdit = (course: ICourse) => {
    setSelectedCourse(course);
    setModalType("edit");
  };

  const onDelete = (course: ICourse) => {
    setSelectedCourse(course);
    setModalType("delete");
  };

  const handleOpenAdd = () => {
    setSelectedCourse(null);
    setModalType("add");
  };

  const handleClose = () => {
    setSelectedCourse(null);
    setModalType(null);
  };

  const handleModalSave = () => {
    setRefreshTrigger(prev => prev + 1);
    handleClose();
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams(prev => {
      prev.set("sort", e.target.value);
      prev.delete("page");
      return prev;
    });
  };

  return {
    courses,
    isLoading,
    pageIndex,
    pageSize,
    search,
    sort,
    modalType,
    totalCount,
    selectedCourse,
    handlePageChange,
    handlePageSizeChange,
    handleDeleteConfirm,
    handleSearchChange,
    onEdit,
    onDelete,
    handleOpenAdd,
    handleClose,
    handleModalSave,
    handleSortChange,
  };
};
