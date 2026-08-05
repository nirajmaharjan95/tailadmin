import { Check, Heart, ImageOff, Loader2, ShoppingCart, X } from "lucide-react";
import { ICourse } from "../types/course.types";
import { useCart } from "@/features/cart/hooks/useCart";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface CourseCardProps {
  course: ICourse;
}

const formatPrice = (price: number | string | null | undefined) =>
  price === undefined || price === null
    ? null
    : Number(price).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });

const CourseCard = ({ course }: CourseCardProps) => {
  const { addToCart, removeFromCart, isInCart, isAdding } = useCart();
  const isAdmin = useIsAdmin();

  const courseId = course.id;
  const inCart = courseId ? isInCart(courseId) : false;
  const addingCourse = courseId ? isAdding(courseId) : false;

  const handleAddToCart = () => {
    if (courseId) addToCart(courseId);
  };

  const handleRemoveFromCart = () => {
    if (courseId && inCart) removeFromCart(courseId);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded border border-gray-200 bg-white shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
      {course.image ? (
        <img
          src={course.image}
          alt={course.title}
          className="aspect-4/3 w-full"
        />
      ) : (
        <div className="flex aspect-4/3 w-full items-center justify-center bg-gray-100 text-sm text-gray-400 dark:bg-gray-800 dark:text-gray-500">
          <ImageOff />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <h5 className="text-base font-semibold text-gray-800 dark:text-white/90">
          {course.title}
        </h5>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-800 dark:text-white/90">
              {formatPrice(course.price)}
            </span>

            <del className="text-sm text-gray-400">
              {formatPrice(course.previous_price)}
            </del>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {Number(course.learners_enrolled ?? 0).toLocaleString()} Learners
            Enrolled
          </p>
        </div>
      </div>

      {!isAdmin && (
        <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          <button
            type="button"
            aria-label="Add to Wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-error-500 hover:text-error-500 dark:border-gray-700 dark:text-gray-400"
          >
            <Heart size={16} />
          </button>
          <button
            type="button"
            aria-label={inCart ? "Remove from Cart" : "Add to Cart"}
            disabled={!courseId || addingCourse}
            onClick={inCart ? handleRemoveFromCart : handleAddToCart}
            className={`group flex h-9 w-9 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
              inCart
                ? "border-brand-500 bg-brand-500 text-white hover:border-error-500 hover:bg-error-500"
                : "border-gray-200 text-gray-500 hover:border-brand-500 hover:text-brand-500 dark:border-gray-700 dark:text-gray-400"
            }`}
          >
            {addingCourse ? (
              <Loader2 size={16} className="animate-spin" />
            ) : inCart ? (
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
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
