import CustomBreadcrumb from "@/components/CustomBreadcrumb";
import CourseCardList from "@/features/course/components/CourseCardList";
import CourseGrid from "@/features/course/components/CourseGrid";
import { useCourses } from "@/features/course/hooks/useCourses";
import { Grid, List, Search } from "lucide-react";
import { useState } from "react";

type ViewMode = "grid" | "list";

const Courses = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const {
    courses,
    totalCount,
    isLoading,
    pageIndex,
    pageSize,
    sort,
    search,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    handleSearchChange,
  } = useCourses();
  return (
    <>
      <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Courses
          </h2>
          <CustomBreadcrumb />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="px-4 py-5 xl:px-6 xl:py-6">
          <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                <Search
                  size={16}
                  className="text-gray-500 dark:text-gray-400"
                />
              </span>
              <input
                id="search-input"
                type="text"
                placeholder="Search or type command..."
                value={search}
                onChange={handleSearchChange}
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-800 dark:bg-gray-900   dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>

            <div className="ml-auto flex gap-4">
              <div className="flex gap-2 items-center">
                sort by:
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="ml-2 rounded-lg border border-gray-200 bg-transparent py-2.5 px-3 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="name">Name</option>
                  <option value="date">Date</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>

              <div className="flex gap-2 items-center">
                view:
                <div className="flex gap-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-brand-500 text-white"
                        : "bg-transparent text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                    aria-label="List view"
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-brand-500 text-white"
                        : "bg-transparent text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {viewMode === "grid" ? (
            <CourseGrid
              courses={courses}
              totalCount={totalCount}
              isLoading={isLoading}
              pageIndex={pageIndex}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
            />
          ) : (
            <CourseCardList
              courses={courses}
              totalCount={totalCount}
              isLoading={isLoading}
              pageIndex={pageIndex}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
              handlePageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Courses;
