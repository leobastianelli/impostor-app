'use client';

import { Room } from '@/types/room';
import { Vote } from '@/types/game';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ResultsScreenProps {
  room: Room;
  onNewGame: () => void;
}

export function ResultsScreen({ room, onNewGame }: ResultsScreenProps) {
  const voteCounts = new Map<string, number>();
  room.votes.forEach((vote: Vote) => {
    voteCounts.set(vote.targetId, (voteCounts.get(vote.targetId) || 0) + 1);
  });

  let mostVotedPlayerId: string | null = null;
  let maxVotes = 0;
  voteCounts.forEach((count, playerId) => {
    if (count > maxVotes) {
      maxVotes = count;
      mostVotedPlayerId = playerId;
    }
  });

  const mostVotedPlayer = mostVotedPlayerId ? room.players[mostVotedPlayerId] : null;
  const impostor = Object.values(room.players).find((p) => p.role === 'impostor');

  const groupWon = room.winner === 'group';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardBody className="text-center py-12">
          <div className="mb-6">
            {groupWon ? (
              <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-5xl">🎉</span>
              </div>
            ) : (
              <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <span className="text-5xl">😈</span>
              </div>
            )}
          </div>

          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            {groupWon ? '¡El Grupo Ganó!' : '¡El Impostor Ganó!'}
          </h2>

          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {groupWon
              ? '¡Descubrieron al impostor!'
              : 'El impostor logró engañar al grupo'}
          </p>
        </CardBody>
      </Card>

      {impostor && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
              El Impostor Era...
            </h3>
          </CardHeader>
          <CardBody>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-xl font-bold text-red-900 dark:text-red-100 mb-2">
                {impostor.name}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Personaje: {impostor.assignedCharacter?.name}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {mostVotedPlayer && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Jugador Más Votado
            </h3>
          </CardHeader>
          <CardBody>
            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4">
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                {mostVotedPlayer.name}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {maxVotes} {maxVotes === 1 ? 'voto' : 'votos'}
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            Resultados de Votación
          </h3>
        </CardHeader>
        <CardBody>
          <ul className="space-y-2">
            {room.votes.map((vote: Vote, index: number) => (
              <li
                key={index}
                className="flex items-center justify-between px-3 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg text-sm"
              >
                <span className="text-zinc-900 dark:text-zinc-50">
                  {vote.voterName}
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">→</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  {vote.targetName}
                </span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Card>
        <CardFooter>
          <Button onClick={onNewGame} className="w-full" size="lg">
            Nueva Partida
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
