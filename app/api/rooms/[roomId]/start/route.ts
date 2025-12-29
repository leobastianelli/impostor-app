import { NextRequest, NextResponse } from 'next/server';
import { roomManager } from '@/lib/game/room-manager';
import { assignCharactersAndImpostor } from '@/lib/game/character-assignment';
import { pusherServer } from '@/lib/pusher/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    if (!pusherServer) {
      return NextResponse.json(
        { error: 'Pusher not configured. Please set environment variables.' },
        { status: 503 }
      );
    }

    const { roomId } = await params;
    const { playerId } = await request.json();

    const room = roomManager.getRoom(roomId);

    if (!room) {
      return NextResponse.json(
        { error: 'Sala no encontrada' },
        { status: 404 }
      );
    }

    if (room.hostId !== playerId) {
      return NextResponse.json(
        { error: 'Solo el host puede iniciar el juego' },
        { status: 403 }
      );
    }

    const playerCount = Object.keys(room.players).length;
    if (playerCount < 3) {
      return NextResponse.json(
        { error: 'Se necesitan al menos 3 jugadores' },
        { status: 400 }
      );
    }

    roomManager.updateRoomPhase(roomId, 'starting');

    const players = Object.values(room.players);
    const assignments = assignCharactersAndImpostor(
      players,
      room.selectedCharacters
    );

    for (const [playerId, assignment] of assignments) {
      room.players[playerId].role = assignment.role;
      room.players[playerId].assignedCharacter = assignment.character;
      room.players[playerId].status = 'playing';

      await pusherServer.trigger(
        `private-player-${playerId}`,
        'character-assigned',
        {
          character: assignment.character,
          role: assignment.role,
        }
      );
    }

    roomManager.updateRoomPhase(roomId, 'revealing');

    await pusherServer.trigger(`presence-room-${roomId}`, 'phase-changed', {
      phase: 'revealing',
    });

    const pusher = pusherServer;
    setTimeout(async () => {
      const playerIds = Object.keys(room.players);
      if (playerIds.length > 0) {
        room.currentTurnPlayerId = playerIds[0];
      }

      roomManager.updateRoomPhase(roomId, 'giving-clues');

      if (pusher) {
        await pusher.trigger(`presence-room-${roomId}`, 'phase-changed', {
          phase: 'giving-clues',
          currentTurnPlayerId: room.currentTurnPlayerId,
        });
      }
    }, 5000);

    const updatedRoom = roomManager.getRoom(roomId);

    return NextResponse.json({ room: updatedRoom });
  } catch (error) {
    console.error('Error starting game:', error);
    return NextResponse.json(
      { error: 'Error al iniciar el juego' },
      { status: 500 }
    );
  }
}
