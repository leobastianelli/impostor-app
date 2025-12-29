'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';

export default function JoinRoomPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (!roomCode.trim()) {
      setError('Por favor ingresa el código de sala');
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const response = await fetch('/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: roomCode.trim().toUpperCase(),
          playerName: playerName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al unirse a la sala');
      }

      localStorage.setItem('playerId', data.playerId);
      localStorage.setItem('playerName', playerName.trim());

      router.push(`/room/${data.roomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Unirse a Sala
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Ingresa el código que te compartieron
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Información del Jugador
            </h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Tu Nombre"
              placeholder="Ingresa tu nombre"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
            <Input
              label="Código de Sala"
              placeholder="ABC123"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="text-center text-2xl font-mono tracking-wider"
            />
          </CardBody>
          <CardFooter className="space-y-3">
            {error && (
              <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">
                  {error}
                </p>
              </div>
            )}
            <Button
              onClick={handleJoinRoom}
              disabled={isJoining || !playerName.trim() || !roomCode.trim()}
              className="w-full"
              size="lg"
            >
              {isJoining ? 'Uniéndose...' : 'Unirse a Sala'}
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
