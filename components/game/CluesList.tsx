'use client';

import { Clue } from '@/types/game';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';

interface CluesListProps {
  clues: Clue[];
}

export function CluesList({ clues }: CluesListProps) {
  const sortedClues = [...clues].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
          Pistas ({clues.length})
        </h3>
      </CardHeader>
      <CardBody>
        {sortedClues.length === 0 ? (
          <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
            Aún no hay pistas
          </p>
        ) : (
          <ul className="space-y-3">
            {sortedClues.map((clue, index) => (
              <li
                key={clue.id}
                className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {clue.playerName}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    #{index + 1}
                  </span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {clue.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
