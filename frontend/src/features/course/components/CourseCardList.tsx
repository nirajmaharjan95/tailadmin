import { Check, Heart, Loader2, ShoppingCart, X } from "lucide-react";
import { ICourse } from "../types/course.types";
import { useCart } from "@/features/cart/hooks/useCart";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseCardListProps {
  courses: ICourse[];
  totalCount: number;
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;
  handlePageChange: (pageIndex: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
}

const formatPrice = (price: number | string | null | undefined) =>
  price === undefined || price === null
    ? null
    : Number(price).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

const CourseCardList = (props: CourseCardListProps) => {
  const {
    courses,
    totalCount,
    isLoading,
    pageIndex,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
  } = props;

  const { addToCart, removeFromCart, isInCart, isAdding } = useCart();

  const currentPage = pageIndex + 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  if (isLoading) {
    return (
      <>
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="grid grid-cols-12 gap-0">
                <div className="col-span-12 md:col-span-4 lg:col-span-3">
                  <Skeleton className="h-48 w-full rounded-none" />
                </div>
                <div className="col-span-12 md:col-span-8 lg:col-span-9 p-5">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
                      <Skeleton className="mb-4 h-6 w-3/4" />
                      <Skeleton className="mb-2 h-4 w-full" />
                      <Skeleton className="mb-2 h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                    <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                      <Skeleton className="mb-2 h-8 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
  }

  if (courses.length === 0) {
    return (
      <div className="mt-6 py-10 text-center text-gray-500 dark:text-gray-400">
        No courses found
      </div>
    );
  }

  return (
    <>
      <div className="mt-6">
        {courses.map(course => (
          <article
            key={course.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] mb-3"
          >
            <div className="grid grid-cols-12 gap-0">
              <div className="col-span-12 md:col-span-4 lg:col-span-3">
                <div className="h-48">
                  {course.image ? (
                    <img
                      className="size-full object-cover"
                      src={course.image}
                      alt={course.title}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gray-100 text-sm text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                      No image
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-12 md:col-span-8 lg:col-span-9 p-5">
                <div className="grid grid-cols-12 gap-4 h-full">
                  <div className="col-span-12 lg:col-span-8 2xl:col-span-9 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
                      {course.title}
                    </h3>
                    {course.short_description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 hidden lg:block line-clamp-3">
                        {course.short_description}
                      </p>
                    )}
                    <div className="flex-1 flex items-end mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {Number(course.learners_enrolled ?? 0).toLocaleString()}{" "}
                        Learners Enrolled
                      </p>
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-4 2xl:col-span-3 mt-4 lg:mt-0">
                    <div className="h-full rounded-lg border border-gray-200 dark:border-gray-700 flex flex-row lg:flex-col justify-between p-4">
                      <div className="lg:mb-4">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xl font-bold text-gray-800 dark:text-white/90">
                            {formatPrice(course.price)}
                          </span>
                          {course.previous_price && (
                            <del className="text-sm text-gray-400">
                              {formatPrice(course.previous_price)}
                            </del>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row lg:flex-col gap-2">
                        <Button
                          variant="outline"
                          size="lg"
                          className="lg:w-full border-gray-200 text-gray-700 hover:border-error-500 hover:text-error-500 dark:border-gray-700 dark:text-gray-300"
                        >
                          <Heart size={16} />
                          <span className="hidden lg:inline">
                            Add to Wishlist
                          </span>
                        </Button>
                        <Button
                          variant="default"
                          size="lg"
                          disabled={
                            !course.id ||
                            isAdding(course.id)
                          }
                          onClick={() =>
                            course.id &&
                            (isInCart(course.id)
                              ? removeFromCart(course.id)
                              : addToCart(course.id))
                          }
                          className={`group lg:w-full text-white ${
                            isInCart(course.id)
                              ? "bg-brand-500 hover:bg-error-500"
                              : "bg-brand-500 hover:bg-brand-600"
                          }`}
                        >
                          {isAdding(course.id) ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : isInCart(course.id) ? (
                            <>
                              <Check
                                size={16}
                                className="transition-colors group-hover:hidden"
                              />
                              <X
                                size={16}
                                className="hidden transition-colors group-hover:block"
                              />
                            </>
                          ) : (
                            <ShoppingCart size={16} />
                          )}
                          <span className="hidden lg:inline">
                            {isAdding(course.id) ? (
                              "Adding..."
                            ) : isInCart(course.id) ? (
                              <>
                                <span className="group-hover:hidden">
                                  Added to Cart
                                </span>
                                <span className="hidden group-hover:inline">
                                  Remove from Cart
                                </span>
                              </>
                            ) : (
                              "Add to Cart"
                            )}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

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

export default CourseCardList;
