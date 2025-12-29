'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Room } from '@/types/room';
import { Player } from '@/types/player';
import { Character } from '@/types/character';
import { PlayerRole } from '@/types/player';
import { pusherClient } from '@/lib/pusher/client';
import { RoomLobby } from '@/components/game/RoomLobby';
import { CharacterReveal } from '@/components/game/CharacterReveal';
import { PlayerList } from '@/components/game/PlayerList';
import { ClueInput } from '@/components/game/ClueInput';
import { CluesList } from '@/components/game/CluesList';
import { VotingPanel } from '@/components/game/VotingPanel';
import { ResultsScreen } from '@/components/game/ResultsScreen';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';



interface GameRoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function GameRoomPage({ params }: GameRoomPageProps) {
  const { roomId } = use(params);
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [assignedCharacter, setAssignedCharacter] = useState<Character | null>(null);
  const [role, setRole] = useState<PlayerRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmittingClue, setIsSubmittingClue] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

useEffect(() => {
  const playerId = localStorage.getItem('playerId');

  if (!playerId) {
    router.push('/');
    return;
  }

  if (!pusherClient) {
    setLoading(false);
    return;
  }

  const client = pusherClient;

  const presenceChannelName = `presence-room-${roomId}`;
  const privateChannelName = `private-player-${playerId}`;

  // Evitar subscripciones duplicadas (Strict Mode / remounts)
  client.unsubscribe(presenceChannelName);
  client.unsubscribe(privateChannelName);

  const channel = client.subscribe(presenceChannelName);

  channel.bind('pusher:subscription_succeeded', () => {
    console.log('Presence channel ready');

    channel.bind('player-joined', (data: { player: Player }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          players: {
            ...prevRoom.players,
            [data.player.id]: data.player,
          },
        };
      });
    });

    channel.bind('player-left', (data: { playerId: string }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null;
        const newPlayers = { ...prevRoom.players };
        delete newPlayers[data.playerId];
        return {
          ...prevRoom,
          players: newPlayers,
        };
      });
    });

    channel.bind('phase-changed', (data: { phase: string; currentTurnPlayerId?: string }) => {
      setRoom((prevRoom) => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          phase: data.phase as Room['phase'],
          currentTurnPlayerId: data.currentTurnPlayerId || prevRoom.currentTurnPlayerId,
        };
      });
    });

    channel.bind(
  'clue-submitted',
  (data: { clue: Room['clues'][number]; currentTurnPlayerId?: string }) => {

      setRoom((prevRoom) => {
        if (!prevRoom) return null;
        return {
          ...prevRoom,
          clues: [...prevRoom.clues, data.clue],
          currentTurnPlayerId: data.currentTurnPlayerId || prevRoom.currentTurnPlayerId,
        };
      });
    });

    channel.bind('vote-submitted', () => {
      setRoom((prevRoom) => prevRoom);
    });

channel.bind(
  'game-ended',
  (data: {
    phase: Room['phase'];
    winner: Room['winner'];
    votes: Room['votes'];
  }) => {

        setRoom((prevRoom) => {
          if (!prevRoom) return null;
          return {
            ...prevRoom,
            phase: data.phase as Room['phase'],
            winner: data.winner as Room['winner'],
            votes: data.votes,
          };
        });
      }
    );

    setLoading(false);
  });

  channel.bind('pusher:subscription_error', (err: unknown) => {
    console.error('Presence subscription error', err);
    setLoading(false);
  });

  const privateChannel = client.subscribe(privateChannelName);

  privateChannel.bind('pusher:subscription_succeeded', () => {
    privateChannel.bind(
      'character-assigned',
      (data: { character: Character; role: PlayerRole }) => {
        setAssignedCharacter(data.character);
        setRole(data.role);
      }
    );
  });

  privateChannel.bind('pusher:subscription_error', (err: unknown) => {
    console.error('Private channel subscription error', err);
  });

  return () => {
    channel.unbind_all();
    client.unsubscribe(presenceChannelName);

    privateChannel.unbind_all();
    client.unsubscribe(privateChannelName);
  };
}, [roomId, router]);


  useEffect(() => {
    const playerId = localStorage.getItem('playerId');

    if (playerId && room) {
      const player = room.players[playerId];
      if (player) {
        setCurrentPlayer(player);
      }
    }
  }, [room]);

  const handleStartGame = async () => {
    const playerId = localStorage.getItem('playerId');
    if (!playerId) return;

    setIsStarting(true);

    try {
      const response = await fetch(`/api/rooms/${roomId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId }),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar el juego');
      }
    } catch (error) {
      console.error('Error starting game:', error);
      setIsStarting(false);
    }
  };

  const handleSubmitClue = async (clueText: string) => {
    const playerId = localStorage.getItem('playerId');
    if (!playerId) return;

    setIsSubmittingClue(true);

    try {
      const response = await fetch(`/api/rooms/${roomId}/clue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, clueText }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar pista');
      }

      const data = await response.json();
      setRoom(data.room);
    } catch (error) {
      console.error('Error submitting clue:', error);
    } finally {
      setIsSubmittingClue(false);
    }
  };

  const handleVote = async (targetId: string) => {
    const playerId = localStorage.getItem('playerId');
    if (!playerId) return;

    setIsVoting(true);

    try {
      const response = await fetch(`/api/rooms/${roomId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerId, targetId }),
      });

      if (!response.ok) {
        throw new Error('Error al votar');
      }

      const data = await response.json();
      setRoom(data.room);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleStartVoting = async () => {
    setRoom((prevRoom) => {
      if (!prevRoom) return null;
      return {
        ...prevRoom,
        phase: 'voting',
      };
    });

    try {
      await fetch(`/api/rooms/${roomId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'start-voting' }),
      });
    } catch (error) {
      console.error('Error starting voting:', error);
    }
  };

  const handleNewGame = () => {
    router.push('/');
  };

  if (loading || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Card>
          <CardBody className="text-center py-12 px-8">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-zinc-50 rounded-full animate-spin" />
            <p className="text-zinc-600 dark:text-zinc-400">
              Cargando sala...
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card>
          <CardBody className="text-center py-8">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              No se encontró tu información de jugador
            </p>
            <Button onClick={() => router.push('/')}>Volver al Inicio</Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (room.phase === 'lobby') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
        <RoomLobby
          room={room}
          currentPlayerId={currentPlayer.id}
          onStartGame={handleStartGame}
          isStarting={isStarting}
        />
      </div>
    );
  }

  if (room.phase === 'revealing' && assignedCharacter && role) {
    return <CharacterReveal character={assignedCharacter} role={role} />;
  }

  if (room.phase === 'giving-clues') {
    const isMyTurn = room.currentTurnPlayerId === currentPlayer.id;

    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 text-center">
                Fase de Pistas
              </h2>
              <p className="text-center text-zinc-600 dark:text-zinc-400 mt-2">
                {isMyTurn
                  ? 'Es tu turno de dar una pista'
                  : `Esperando a ${room.players[room.currentTurnPlayerId || '']?.name || 'otro jugador'}`}
              </p>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {isMyTurn && (
                <ClueInput
                  playerName={currentPlayer.name}
                  onSubmit={handleSubmitClue}
                  isSubmitting={isSubmittingClue}
                  hasSubmitted={currentPlayer.hasSubmittedClue}
                />
              )}
              <CluesList clues={room.clues} />
            </div>
            <div>
              <PlayerList
                players={Object.values(room.players)}
                currentPlayerId={room.currentTurnPlayerId || undefined}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (room.phase === 'debating') {
    const isHost = room.hostId === currentPlayer.id;

    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 text-center">
                Fase de Debate
              </h2>
              <p className="text-center text-zinc-600 dark:text-zinc-400 mt-2">
                Discutan quién creen que es el impostor
              </p>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CluesList clues={room.clues} />
            </div>
            <div>
              <PlayerList players={Object.values(room.players)} />
            </div>
          </div>

          {isHost && (
            <Card>
              <CardBody className="text-center">
                <Button onClick={handleStartVoting} className="w-full" size="lg">
                  Pasar a Votación
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    );
  }

  if (room.phase === 'voting') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardBody>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 text-center">
                Votación
              </h2>
              <p className="text-center text-zinc-600 dark:text-zinc-400 mt-2">
                Vota por quien crees que es el impostor
              </p>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <VotingPanel
                players={Object.values(room.players)}
                currentPlayerId={currentPlayer.id}
                onVote={handleVote}
                isVoting={isVoting}
                hasVoted={currentPlayer.hasVoted}
              />
            </div>
            <div className="space-y-6">
              <PlayerList players={Object.values(room.players)} />
              <CluesList clues={room.clues} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (room.phase === 'results') {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
        <ResultsScreen room={room} onNewGame={handleNewGame} />
      </div>
    );
  }

  return null;
}
