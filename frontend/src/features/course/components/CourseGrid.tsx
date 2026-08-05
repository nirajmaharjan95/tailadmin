import Pagination from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import CourseCard from "./CourseCard";
import { ICourse } from "../types/course.types";

interface CourseGridProps {
  courses: ICourse[];
  totalCount: number;
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;
  handlePageChange: (pageIndex: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
}

const CourseGrid = (props: CourseGridProps) => {
  const {
    courses,
    totalCount,
    isLoading,
    pageIndex,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  } = props;

  const currentPage = pageIndex + 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mt-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          : courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
      </div>

      {!isLoading && courses.length === 0 && (
        <div className="py-10 text-center text-gray-500 dark:text-gray-400">
          No courses found
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPrev={() => handlePageChange(pageIndex - 1)}
        onNext={() => handlePageChange(pageIndex + 1)}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};

export default CourseGrid;
