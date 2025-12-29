import { NextRequest, NextResponse } from 'next/server';
import { roomManager } from '@/lib/game/room-manager';
import { Character } from '@/types/character';

export async function POST(request: NextRequest) {
  try {
    const { hostName, selectedCharacters, maxPlayers } = await request.json();

    if (!hostName || !selectedCharacters || selectedCharacters.length < 2) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    const room = roomManager.createRoom(
      hostName,
      selectedCharacters as Character[],
      maxPlayers || 12
    );

    const hostPlayer = Object.values(room.players)[0];

    return NextResponse.json({
      roomId: room.id,
      code: room.code,
      playerId: hostPlayer.id,
      room,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Error al crear la sala' },
      { status: 500 }
    );
  }
}
