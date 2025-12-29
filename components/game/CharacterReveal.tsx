'use client';

import { Character } from '@/types/character';
import { PlayerRole } from '@/types/player';
import { Card, CardBody } from '@/components/ui/Card';

interface CharacterRevealProps {
  character: Character;
  role: PlayerRole;
}

export function CharacterReveal({ character, role }: CharacterRevealProps) {
  const isImpostor = role === 'impostor';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center py-12">
          <div className="mb-6">
            {isImpostor ? (
              <div className="w-24 h-24 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <span className="text-5xl">😈</span>
              </div>
            ) : (
              <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <span className="text-5xl">🕵️</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            {isImpostor ? '¡Eres el Impostor!' : 'Eres un Jugador Regular'}
          </h2>

          <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-6 mb-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              Tu personaje es:
            </p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              {character.name}
            </p>
            {character.description && (
              <p className="text-zinc-600 dark:text-zinc-400">
                {character.description}
              </p>
            )}
          </div>

          {isImpostor ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
              <p>Debes dar pistas convincentes sin revelar que no conoces el personaje real.</p>
              <p>Si logras no ser descubierto, ¡ganas!</p>
            </div>
          ) : (
            <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
              <p>Todos tienen el mismo personaje excepto el impostor.</p>
              <p>Da pistas relacionadas con tu personaje para identificar al impostor.</p>
            </div>
          )}

          <div className="mt-6 text-xs text-zinc-500 dark:text-zinc-500">
            El juego comenzará en unos segundos...
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
