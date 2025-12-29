import { NextRequest, NextResponse } from 'next/server';
import { roomManager } from '@/lib/game/room-manager';
import { pusherServer } from '@/lib/pusher/server';
import { Vote } from '@/types/game';

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
    const { playerId, targetId } = await request.json();

    const room = roomManager.getRoom(roomId);

    if (!room) {
      return NextResponse.json(
        { error: 'Sala no encontrada' },
        { status: 404 }
      );
    }

    if (room.phase !== 'voting') {
      return NextResponse.json(
        { error: 'No es la fase de votación' },
        { status: 400 }
      );
    }

    const player = room.players[playerId];
    const target = room.players[targetId];

    if (!player || !target) {
      return NextResponse.json(
        { error: 'Jugador no encontrado' },
        { status: 404 }
      );
    }

    if (playerId === targetId) {
      return NextResponse.json(
        { error: 'No puedes votar por ti mismo' },
        { status: 400 }
      );
    }

    if (player.hasVoted) {
      return NextResponse.json(
        { error: 'Ya votaste' },
        { status: 400 }
      );
    }

    const vote: Vote = {
      voterId: player.id,
      voterName: player.name,
      targetId: target.id,
      targetName: target.name,
      submittedAt: Date.now(),
    };

    room.votes.push(vote);
    player.hasVoted = true;
    player.votedFor = targetId;

    roomManager.updateRoom(roomId, room);

    await pusherServer.trigger(`presence-room-${roomId}`, 'vote-submitted', {
      voterId: playerId,
    });

    const allVoted = Object.values(room.players).every((p) => p.hasVoted);

    if (allVoted) {
      const voteCounts = new Map<string, number>();

      room.votes.forEach((v) => {
        voteCounts.set(v.targetId, (voteCounts.get(v.targetId) || 0) + 1);
      });

      let mostVotedPlayerId: string | null = null;
      let maxVotes = 0;

      voteCounts.forEach((count, pId) => {
        if (count > maxVotes) {
          maxVotes = count;
          mostVotedPlayerId = pId;
        }
      });

      if (mostVotedPlayerId) {
        const mostVotedPlayer = room.players[mostVotedPlayerId];
        room.winner = mostVotedPlayer.role === 'impostor' ? 'group' : 'impostor';
      }

      roomManager.updateRoomPhase(roomId, 'results');

      await pusherServer.trigger(`presence-room-${roomId}`, 'game-ended', {
        phase: 'results',
        winner: room.winner,
        mostVotedPlayerId,
        votes: room.votes,
      });
    }

    const updatedRoom = roomManager.getRoom(roomId);

    return NextResponse.json({ room: updatedRoom });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json(
      { error: 'Error al votar' },
      { status: 500 }
    );
  }
}
