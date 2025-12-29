'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Character } from '@/types/character';
import { DEFAULT_CHARACTERS } from '@/data/characters';
import { CharacterSelector } from '@/components/characters/CharacterSelector';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';

export default function CreateRoomPage() {
  const router = useRouter();
  const [hostName, setHostName] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>(
    DEFAULT_CHARACTERS.slice(0, 10)
  );
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    if (!hostName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (selectedCharacters.length < 2) {
      setError('Selecciona al menos 2 personajes');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hostName: hostName.trim(),
          selectedCharacters,
          maxPlayers: 12,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la sala');
      }

      const data = await response.json();

      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('playerName', hostName.trim());

      router.push(`/room/${data.roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Crear Sala
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Configura tu sala y selecciona los personajes
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Información del Host
            </h2>
          </CardHeader>
          <CardBody>
            <Input
              label="Tu Nombre"
              placeholder="Ingresa tu nombre"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              error={error && !hostName.trim() ? error : undefined}
            />
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <CharacterSelector
              selectedCharacters={selectedCharacters}
              onSelectionChange={setSelectedCharacters}
              minSelection={2}
              maxSelection={20}
            />
          </CardBody>
        </Card>

        {error && !hostName.trim() === false && (
          <Card>
            <CardBody>
              <p className="text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardFooter className="space-y-3">
            <Button
              onClick={handleCreateRoom}
              disabled={isCreating || !hostName.trim() || selectedCharacters.length < 2}
              className="w-full"
              size="lg"
            >
              {isCreating ? 'Creando Sala...' : 'Crear Sala'}
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="secondary"
              className="w-full"
            >
              Cancelar
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
