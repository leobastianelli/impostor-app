'use client';

import { Room } from '@/types/room';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PlayerList } from './PlayerList';

interface RoomLobbyProps {
  room: Room;
  currentPlayerId: string;
  onStartGame: () => void;
  isStarting: boolean;
}

export function RoomLobby({
  room,
  currentPlayerId,
  onStartGame,
  isStarting,
}: RoomLobbyProps) {
  const players = Object.values(room.players);
  const isHost = room.hostId === currentPlayerId;
  const canStart = players.length >= 3;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Sala de Espera
            </h1>
            <div className="inline-block px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Código de sala
              </p>
              <p className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-50">
                {room.code}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-center text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Comparte este código con tus amigos para que se unan
          </div>
        </CardBody>
      </Card>

      <PlayerList players={players} />

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Personajes Seleccionados ({room.selectedCharacters.length})
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {room.selectedCharacters.map((character) => (
              <div
                key={character.id}
                className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm"
              >
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {character.name}
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {isHost && (
        <Card>
          <CardFooter>
            <div className="w-full space-y-3">
              {!canStart && (
                <p className="text-sm text-center text-amber-600 dark:text-amber-400">
                  Se necesitan al menos 3 jugadores para comenzar
                </p>
              )}
              <Button
                onClick={onStartGame}
                disabled={!canStart || isStarting}
                className="w-full"
                size="lg"
              >
                {isStarting ? 'Iniciando...' : 'Iniciar Juego'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {!isHost && (
        <Card>
          <CardBody>
            <p className="text-center text-zinc-600 dark:text-zinc-400">
              Esperando a que el host inicie el juego...
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
