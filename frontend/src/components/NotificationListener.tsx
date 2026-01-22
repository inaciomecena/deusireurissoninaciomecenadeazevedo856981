import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';

export function NotificationListener() {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws/websocket',
      onConnect: () => {
        client.subscribe('/topic/novos-albuns', (message) => {
          setNotification(message.body);
          setTimeout(() => setNotification(null), 5000);
        });
      },
      // debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  if (!notification) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-bounce">
      <div className="bg-cyber-dark/90 backdrop-blur-xl border border-neon-green/50 text-white p-6 rounded-2xl shadow-[0_0_30px_rgba(74,222,128,0.3)] relative overflow-hidden max-w-sm">
        <div className="absolute top-0 left-0 w-1 h-full bg-neon-green"></div>
        <div className="absolute -right-4 -top-4 w-16 h-16 bg-neon-green/20 rounded-full blur-xl"></div>
        
        <div className="flex items-start gap-4">
          <div className="p-2 bg-neon-green/10 rounded-lg text-neon-green">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-neon-green text-lg mb-1">Nova Batida!</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{notification}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
