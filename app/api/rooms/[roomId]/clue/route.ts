import { NextRequest, NextResponse } from 'next/server';
import { roomManager } from '@/lib/game/room-manager';
import { pusherServer } from '@/lib/pusher/server';
import { nanoid } from 'nanoid';
import { Clue } from '@/types/game';

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
    const { playerId, clueText } = await request.json();

    const room = roomManager.getRoom(roomId);

    if (!room) {
      return NextResponse.json(
        { error: 'Sala no encontrada' },
        { status: 404 }
      );
    }

    if (room.phase !== 'giving-clues') {
      return NextResponse.json(
        { error: 'No es la fase de dar pistas' },
        { status: 400 }
      );
    }

    const player = room.players[playerId];

    if (!player) {
      return NextResponse.json(
        { error: 'Jugador no encontrado' },
        { status: 404 }
      );
    }

    if (player.hasSubmittedClue) {
      return NextResponse.json(
        { error: 'Ya enviaste tu pista' },
        { status: 400 }
      );
    }

    const clue: Clue = {
      id: nanoid(),
      playerId: player.id,
      playerName: player.name,
      text: clueText,
      submittedAt: Date.now(),
      order: room.clues.length,
    };

    room.clues.push(clue);
    player.hasSubmittedClue = true;

    const playerIds = Object.keys(room.players);
    const currentPlayerIndex = playerIds.indexOf(playerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % playerIds.length;

    if (nextPlayerIndex < playerIds.length) {
      room.currentTurnPlayerId = playerIds[nextPlayerIndex];
    }

    roomManager.updateRoom(roomId, room);

    await pusherServer.trigger(`presence-room-${roomId}`, 'clue-submitted', {
      clue,
      currentTurnPlayerId: room.currentTurnPlayerId,
    });

    const allSubmitted = Object.values(room.players).every(
      (p) => p.hasSubmittedClue
    );

    if (allSubmitted) {
      roomManager.updateRoomPhase(roomId, 'debating');

      await pusherServer.trigger(`presence-room-${roomId}`, 'phase-changed', {
        phase: 'debating',
      });
    }

    const updatedRoom = roomManager.getRoom(roomId);

    return NextResponse.json({ room: updatedRoom });
  } catch (error) {
    console.error('Error submitting clue:', error);
    return NextResponse.json(
      { error: 'Error al enviar pista' },
      { status: 500 }
    );
  }
}
