import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { getAuthToken, subscribeAuthToken } from "@/api/auth";
import * as cartApi from "../api/cart.service";
import { CartItem } from "../types/cart.types";
import { onError, onSuccess } from "@/utils/toast";
import { CartContext, CartContextType } from "./CartContext";

// The access token is published asynchronously by AuthProvider (session
// restore happens via POST /auth/refresh on mount), so a user action can fire
// before it exists. Resolves with the token immediately when already
// available, otherwise defers until one is published — without this, an
// authenticated request made too early would be rejected as unauthenticated
// and surface a misleading error to the user.
const waitForAuthToken = (): Promise<string | null> => {
  const currentToken = getAuthToken();
  if (currentToken) return Promise.resolve(currentToken);

  return new Promise<string | null>(resolve => {
    const unsubscribeFromAuth = subscribeAuthToken(receivedToken => {
      if (receivedToken) {
        unsubscribeFromAuth();
        resolve(receivedToken);
      }
    });
  });
};

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingIds, setAddingIds] = useState<Set<number>>(new Set());

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await cartApi.getCartItems();
      setItems(res.data);
    } catch (error) {
      onError(error, "Failed to load cart");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch the cart only when an access token is available — otherwise the
  // first request would race the session restore and 401 with a false error.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setIsLoading(true);
        const res = await cartApi.getCartItems();
        if (!cancelled) setItems(res.data);
      } catch (error) {
        if (!cancelled) onError(error, "Failed to load cart");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    if (getAuthToken()) load();
    const unsubscribe = subscribeAuthToken(token => {
      if (token) load();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const isInCart = useCallback(
    (courseId: number | undefined) =>
      courseId !== undefined && courseId !== null
        ? items.some(item => item.course_id === courseId)
        : false,
    [items]
  );

  const isAdding = useCallback(
    (courseId: number | undefined) =>
      courseId !== undefined && courseId !== null
        ? addingIds.has(courseId)
        : false,
    [addingIds]
  );

  const addToCart = useCallback(
    async (courseId: number): Promise<boolean> => {
      if (isInCart(courseId) || addingIds.has(courseId)) return false;

      // Wait for the auth token to be available before making the request
      // to avoid 401 errors from racing the session restore
      await waitForAuthToken();

      setAddingIds(prev => new Set(prev).add(courseId));
      try {
        await cartApi.addCourseToCart(courseId);
        onSuccess("Course added to cart");
        await refresh();
        return true;
      } catch (error) {
        onError(error, "Failed to add to cart");
        return false;
      } finally {
        setAddingIds(prev => {
          const next = new Set(prev);
          next.delete(courseId);
          return next;
        });
      }
    },
    [isInCart, addingIds, refresh]
  );

  const removeFromCart = useCallback(
    async (courseId: number) => {
      try {
        await cartApi.removeCourseFromCart(courseId);
        onSuccess("Course removed from cart");
        await refresh();
      } catch (error) {
        onError(error, "Failed to remove from cart");
      }
    },
    [refresh]
  );

  const value = useMemo<CartContextType>(
    () => ({
      items,
      count: items.length,
      isLoading,
      isInCart,
      isAdding,
      addToCart,
      removeFromCart,
    }),
    [items, isLoading, isInCart, isAdding, addToCart, removeFromCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;
