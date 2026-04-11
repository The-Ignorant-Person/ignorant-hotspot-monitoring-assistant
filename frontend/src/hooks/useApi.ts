import { useState, useEffect, useCallback } from 'react';

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export function useKeywords() {
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await request<any[]>('/keywords');
      setKeywords(data);
    } catch (e) {
      console.error('Failed to fetch keywords:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const add = async (keyword: string, scope = 'all') => {
    const created = await request<any>('/keywords', {
      method: 'POST',
      body: JSON.stringify({ keyword, scope }),
    });
    setKeywords((prev) => [created, ...prev]);
    return created;
  };

  const toggle = async (id: number, active: boolean) => {
    const updated = await request<any>(`/keywords/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    });
    setKeywords((prev) => prev.map((k) => (k.id === id ? updated : k)));
  };

  const remove = async (id: number) => {
    await request(`/keywords/${id}`, { method: 'DELETE' });
    setKeywords((prev) => prev.filter((k) => k.id !== id));
  };

  return { keywords, loading, add, toggle, remove, refresh };
}

export function useHotspots() {
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await request<any[]>('/hotspots');
      setHotspots(data);
    } catch (e) {
      console.error('Failed to fetch hotspots:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { hotspots, loading, refresh };
}

export function useTrends() {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await request<any[]>('/trends');
      setTrends(data);
    } catch (e) {
      console.error('Failed to fetch trends:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { trends, loading, refresh };
}

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await request<Record<string, string>>('/settings');
      setSettings(data);
    } catch (e) {
      console.error('Failed to fetch settings:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const update = async (updates: Record<string, string>) => {
    await request('/settings', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return { settings, loading, update, refresh };
}

export function useStatus() {
  const [status, setStatus] = useState<any>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await request<any>('/status');
      setStatus(data);
    } catch {
      setStatus(null);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  return { status, refresh };
}

export async function triggerScan(): Promise<void> {
  await request('/scan', { method: 'POST' });
}
