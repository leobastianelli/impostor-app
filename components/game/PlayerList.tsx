'use client';

import { Player } from '@/types/player';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
  showRoles?: boolean;
}

export function PlayerList({
  players,
  currentPlayerId,
  showRoles = false,
}: PlayerListProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
          Jugadores ({players.length})
        </h3>
      </CardHeader>
      <CardBody>
        <ul className="space-y-2">
          {players.map((player) => (
            <li
              key={player.id}
              className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                player.id === currentPlayerId
                  ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  : 'bg-zinc-50 dark:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    player.status === 'playing'
                      ? 'bg-green-500'
                      : 'bg-zinc-400'
                  }`}
                />
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {player.name}
                </span>
                {player.isHost && (
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                    Host
                  </span>
                )}
                {showRoles && player.role && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      player.role === 'impostor'
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    }`}
                  >
                    {player.role === 'impostor' ? 'Impostor' : 'Regular'}
                  </span>
                )}
              </div>
              {player.hasSubmittedClue && (
                <span className="text-xs text-green-600 dark:text-green-400">
                  Pista enviada
                </span>
              )}
              {player.hasVoted && (
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  Votó
                </span>
              )}
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
