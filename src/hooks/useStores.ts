import { useState, useEffect, useCallback } from "react";
import { api } from "../services/api";
import { Store } from "../types";

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.myStores();
      setStores(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createStore = async (name: string, slug: string, description?: string) => {
    try {
      const newStore = await api.createStore(name, slug, description);
      setStores((prev) => [...prev, newStore]);
      return newStore;
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return { stores, loading, error, fetchStores, createStore };
}
