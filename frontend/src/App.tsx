import { useEffect } from 'react';
import RadarHeader from './components/RadarHeader';
import KeywordManager from './components/KeywordManager';
import HotspotFeed from './components/HotspotFeed';
import NotificationPanel from './components/NotificationPanel';
import TrendRadar from './components/TrendRadar';
import SettingsPanel from './components/SettingsPanel';
import StatusBar from './components/StatusBar';
import { BackgroundBeams } from './components/ui/background-beams';
import { useKeywords, useHotspots, useTrends, useSettings, useStatus } from './hooks/useApi';
import { useWebSocket } from './hooks/useWebSocket';

export default function App() {
  const keywords = useKeywords();
  const hotspots = useHotspots();
  const trends = useTrends();
  const settings = useSettings();
  const { status } = useStatus();
  const ws = useWebSocket();

  useEffect(() => {
    return ws.onEvent((msg) => {
      if (msg.type === 'scan_complete' || msg.type === 'new_hotspot') {
        hotspots.refresh();
        trends.refresh();
      }
    });
  }, [ws.onEvent, hotspots.refresh, trends.refresh]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Ambient background beams — sits behind everything */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-60">
        <BackgroundBeams />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <RadarHeader
          totalHotspots={status?.totalHotspots ?? 0}
          activeKeywords={status?.activeKeywords ?? 0}
          connected={ws.connected}
        />

        <main className="mx-auto flex w-full max-w-[1480px] flex-1 gap-5 p-5 lg:flex-row flex-col">
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <KeywordManager
              keywords={keywords.keywords}
              onAdd={keywords.add}
              onToggle={keywords.toggle}
              onRemove={keywords.remove}
            />
            <HotspotFeed hotspots={hotspots.hotspots} loading={hotspots.loading} />
          </div>

          <aside className="flex w-full flex-shrink-0 flex-col gap-5 lg:w-[340px]">
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
    </div>
  );
}
