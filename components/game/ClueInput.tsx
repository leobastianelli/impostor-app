'use client';

import { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ClueInputProps {
  playerName: string;
  onSubmit: (clue: string) => void;
  isSubmitting: boolean;
  hasSubmitted: boolean;
}

export function ClueInput({
  playerName,
  onSubmit,
  isSubmitting,
  hasSubmitted,
}: ClueInputProps) {
  const [clue, setClue] = useState('');

  const handleSubmit = () => {
    if (clue.trim()) {
      onSubmit(clue.trim());
      setClue('');
    }
  };

  if (hasSubmitted) {
    return (
      <Card>
        <CardBody className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
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
            ¡Pista Enviada!
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            Esperando a que los demás jugadores envíen sus pistas...
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
          Es tu turno, {playerName}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Da una pista relacionada con tu personaje (sin decir el nombre)
        </p>
      </CardHeader>
      <CardBody>
        <Input
          placeholder="Escribe tu pista aquí..."
          value={clue}
          onChange={(e) => setClue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={isSubmitting}
        />
      </CardBody>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={!clue.trim() || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Pista'}
        </Button>
      </CardFooter>
    </Card>
  );
}
