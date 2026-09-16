"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type {
  Product,
  ProductSize,
} from "@/types/product";

export type CartItem = {
  product: Product;
  size: ProductSize;
  quantity: number;
};

type AddToCartInput = {
  product: Product;
  size: ProductSize;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isHydrated: boolean;
  addToCart: (input: AddToCartInput) => void;
  removeFromCart: (
    productId: string,
    sizeMl: number,
  ) => void;
  updateQuantity: (
    productId: string,
    sizeMl: number,
    quantity: number,
  ) => void;
  clearCart: () => void;
};

const CartContext =
  createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "perfume-store-cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // =========================================================
  // LOAD CART FROM LOCAL STORAGE
  // =========================================================

  useEffect(() => {
    try {
      const storedCart =
        window.localStorage.getItem(
          CART_STORAGE_KEY,
        );

      if (storedCart) {
        const parsedCart = JSON.parse(
          storedCart,
        ) as CartItem[];

        if (Array.isArray(parsedCart)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(parsedCart);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load cart from localStorage:",
        error,
      );
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // =========================================================
  // SAVE CART TO LOCAL STORAGE
  // =========================================================

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items),
      );
    } catch (error) {
      console.error(
        "Failed to save cart to localStorage:",
        error,
      );
    }
  }, [items, isHydrated]);

  // =========================================================
  // ADD TO CART
  // =========================================================

  const addToCart = ({
    product,
    size,
    quantity,
  }: AddToCartInput) => {
    if (
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      return;
    }

    if (size.stockQuantity <= 0) {
      return;
    }

    setItems((currentItems) => {
      const existingIndex =
        currentItems.findIndex(
          (item) =>
            item.product.id === product.id &&
            item.size.ml === size.ml,
        );

      if (existingIndex === -1) {
        return [
          ...currentItems,
          {
            product,
            size,
            quantity: Math.min(
              quantity,
              size.stockQuantity,
            ),
          },
        ];
      }

      return currentItems.map(
        (item, index) => {
          if (index !== existingIndex) {
            return item;
          }

          const nextQuantity = Math.min(
            item.quantity + quantity,
            size.stockQuantity,
          );

          return {
            ...item,
            quantity: nextQuantity,
          };
        },
      );
    });
  };

  // =========================================================
  // REMOVE FROM CART
  // =========================================================

  const removeFromCart = (
    productId: string,
    sizeMl: number,
  ) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.size.ml === sizeMl
          ),
      ),
    );
  };

  // =========================================================
  // UPDATE QUANTITY
  // =========================================================

  const updateQuantity = (
    productId: string,
    sizeMl: number,
    quantity: number,
  ) => {
    if (!Number.isInteger(quantity)) {
      return;
    }

    if (quantity <= 0) {
      removeFromCart(productId, sizeMl);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (
          item.product.id !== productId ||
          item.size.ml !== sizeMl
        ) {
          return item;
        }

        return {
          ...item,
          quantity: Math.min(
            quantity,
            item.size.stockQuantity,
          ),
        };
      }),
    );
  };

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCart = () => {
    setItems([]);
  };

  // =========================================================
  // DERIVED VALUES
  // =========================================================

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      ),
    [items],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          item.size.price *
          item.quantity,
        0,
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      isHydrated,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      items,
      itemCount,
      subtotal,
      isHydrated,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider",
    );
  }

  return context;
}