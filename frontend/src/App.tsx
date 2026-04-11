import { useEffect } from 'react';
import RadarHeader from './components/RadarHeader';
import KeywordManager from './components/KeywordManager';
import HotspotFeed from './components/HotspotFeed';
import NotificationPanel from './components/NotificationPanel';
import TrendRadar from './components/TrendRadar';
import SettingsPanel from './components/SettingsPanel';
import StatusBar from './components/StatusBar';
import { useKeywords, useHotspots, useTrends, useSettings, useStatus } from './hooks/useApi';
import { useWebSocket } from './hooks/useWebSocket';

export default function App() {
  const keywords = useKeywords();
  const hotspots = useHotspots();
  const trends = useTrends();
  const settings = useSettings();
  const { status } = useStatus();
  const ws = useWebSocket();

  // Refresh data when scan completes
  useEffect(() => {
    return ws.onEvent((msg) => {
      if (msg.type === 'scan_complete' || msg.type === 'new_hotspot') {
        hotspots.refresh();
        trends.refresh();
      }
    });
  }, [ws.onEvent, hotspots.refresh, trends.refresh]);

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <RadarHeader
        totalHotspots={status?.totalHotspots ?? 0}
        activeKeywords={status?.activeKeywords ?? 0}
        connected={ws.connected}
      />

      <main className="flex-1 p-4 flex gap-4 max-w-[1440px] mx-auto w-full">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <KeywordManager
            keywords={keywords.keywords}
            onAdd={keywords.add}
            onToggle={keywords.toggle}
            onRemove={keywords.remove}
          />
          <HotspotFeed hotspots={hotspots.hotspots} loading={hotspots.loading} />
        </div>

        <aside className="w-80 flex-shrink-0 flex flex-col gap-4">
          <NotificationPanel
            notifications={ws.notifications}
            onClear={ws.clearNotifications}
          />
          <TrendRadar trends={trends.trends} loading={trends.loading} />
          <SettingsPanel settings={settings.settings} onUpdate={settings.update} />
        </aside>
      </main>

      <StatusBar connected={ws.connected} />
    </div>
  );
}
