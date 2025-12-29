import { NextRequest, NextResponse } from 'next/server';
import { roomManager } from '@/lib/game/room-manager';
import { validateRoomCode } from '@/lib/utils/room-code';
import { pusherServer } from '@/lib/pusher/server';

export async function POST(request: NextRequest) {
  try {
    const { code, playerName } = await request.json();

    if (!code || !playerName) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    if (!validateRoomCode(code)) {
      return NextResponse.json(
        { error: 'Código de sala inválido' },
        { status: 400 }
      );
    }

    const room = roomManager.getRoomByCode(code);

    if (!room) {
      return NextResponse.json(
        { error: 'Sala no encontrada' },
        { status: 404 }
      );
    }

    const result = roomManager.addPlayer(room.id, playerName);

    if (!result) {
      return NextResponse.json(
        { error: 'No se pudo unir a la sala' },
        { status: 500 }
      );
    }

    await pusherServer.trigger(`presence-room-${room.id}`, 'player-joined', {
      player: result.player,
    });

    return NextResponse.json({
      roomId: result.room.id,
      playerId: result.player.id,
      room: result.room,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error joining room:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
