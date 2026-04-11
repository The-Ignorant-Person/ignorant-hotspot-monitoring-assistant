import { useState, useEffect, useCallback, useRef } from 'react';
import type { Notification } from '../types';

export function useWebSocket() {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<Set<(event: any) => void>>(new Set());

  const addNotification = useCallback((n: Notification) => {
    setNotifications((prev) => [n, ...prev].slice(0, 100));
  }, []);

  const connect = useCallback(() => {
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${location.host}/ws`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      // Reconnect after 3s
      setTimeout(connect, 3000);
    };
    ws.onerror = () => ws.close();

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        // Add as notification
        const n: Notification = {
          id: Date.now().toString(),
          type: msg.type,
          message: formatMessage(msg),
          timestamp: new Date().toISOString(),
        };
        addNotification(n);

        // Show browser notification for new hotspots
        if (msg.type === 'new_hotspot' && Notification.permission === 'granted') {
          new window.Notification(`信号站: ${msg.data?.title || '新热点'}`, {
            body: msg.data?.summary || '',
            icon: '/favicon.svg',
          });
        }

        // Notify listeners
        listenersRef.current.forEach((fn) => fn(msg));
      } catch { /* ignore */ }
    };

    return ws;
  }, [addNotification]);

  useEffect(() => {
    const ws = connect();
    return () => { ws.close(); };
  }, [connect]);

  const onEvent = useCallback((fn: (event: any) => void) => {
    listenersRef.current.add(fn);
    return () => { listenersRef.current.delete(fn); };
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return { connected, notifications, clearNotifications, onEvent };
}

function formatMessage(msg: any): string {
  switch (msg.type) {
    case 'connected':
      return msg.data?.message || '信号站已连接';
    case 'new_hotspot':
      return `新信号: "${msg.data?.title}" [强度:${msg.data?.score}] [来源:${msg.data?.source}]`;
    case 'scan_start':
      return '正在扫描信号源...';
    case 'scan_complete':
      return `扫描完成，发现 ${msg.data?.hotspots || 0} 条新信号，${msg.data?.trends || 0} 个趋势`;
    case 'error':
      return msg.data?.message || '未知错误';
    default:
      return JSON.stringify(msg.data);
  }
}
