import { useState, useCallback } from "react";
import { api } from "../services/api";
import { Product } from "../types";

export function useProducts(storeId?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listProducts(id);
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (
    storeId: number,
    name: string,
    price: number,
    stock?: number,
    description?: string
  ) => {
    const newProduct = await api.createProduct(storeId, name, price, stock, description);
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  return { products, loading, error, fetchProducts, createProduct };
}
