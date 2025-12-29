'use client';

import { useState } from 'react';
import { Player } from '@/types/player';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface VotingPanelProps {
  players: Player[];
  currentPlayerId: string;
  onVote: (targetId: string) => void;
  isVoting: boolean;
  hasVoted: boolean;
}

export function VotingPanel({
  players,
  currentPlayerId,
  onVote,
  isVoting,
  hasVoted,
}: VotingPanelProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const votablePlayers = players.filter((p) => p.id !== currentPlayerId);
  const votedCount = players.filter((p) => p.hasVoted).length;

  const handleVote = () => {
    if (selectedPlayerId) {
      onVote(selectedPlayerId);
    }
  };

  if (hasVoted) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            ¡Voto Registrado!
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            {votedCount} de {players.length} jugadores han votado
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
          Vota por el Impostor
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Selecciona a quién crees que es el impostor
        </p>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          {votablePlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => setSelectedPlayerId(player.id)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                selectedPlayerId === player.id
                  ? 'border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {player.name}
                </span>
                {selectedPlayerId === player.id && (
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </CardBody>
      <CardFooter>
        <Button
          onClick={handleVote}
          disabled={!selectedPlayerId || isVoting}
          className="w-full"
        >
          {isVoting ? 'Votando...' : 'Confirmar Voto'}
        </Button>
      </CardFooter>
    </Card>
  );
}
