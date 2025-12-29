import { Room, GamePhase } from '@/types/room';
import { Player } from '@/types/player';
import { Character } from '@/types/character';
import { nanoid } from 'nanoid';
import { generateRoomCode } from '@/lib/utils/room-code';

class RoomManager {
  private rooms: Map<string, Room> = new Map();

  createRoom(
    hostName: string,
    selectedCharacters: Character[],
    maxPlayers: number = 12
  ): Room {
    const roomId = nanoid();
    const code = generateRoomCode();
    const hostId = nanoid();

    const host: Player = {
      id: hostId,
      name: hostName,
      isHost: true,
      role: null,
      assignedCharacter: null,
      status: 'waiting',
      hasSubmittedClue: false,
      hasVoted: false,
      votedFor: null,
      joinedAt: Date.now(),
    };

    const room: Room = {
      id: roomId,
      code,
      hostId,
      phase: 'lobby',
      players: { [hostId]: host },
      maxPlayers,
      selectedCharacters,
      currentTurnPlayerId: null,
      clues: [],
      votes: [],
      winner: null,
      createdAt: Date.now(),
      startedAt: null,
    };

    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId: string): Room | null {
    return this.rooms.get(roomId) || null;
  }

  getRoomByCode(code: string): Room | null {
    for (const room of this.rooms.values()) {
      if (room.code === code) {
        return room;
      }
    }
    return null;
  }

  addPlayer(roomId: string, playerName: string): { room: Room; player: Player } | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const playerCount = Object.keys(room.players).length;
    if (playerCount >= room.maxPlayers) {
      throw new Error('La sala está llena');
    }

    if (room.phase !== 'lobby') {
      throw new Error('El juego ya comenzó');
    }

    const playerId = nanoid();
    const player: Player = {
      id: playerId,
      name: playerName,
      isHost: false,
      role: null,
      assignedCharacter: null,
      status: 'waiting',
      hasSubmittedClue: false,
      hasVoted: false,
      votedFor: null,
      joinedAt: Date.now(),
    };

    room.players[playerId] = player;
    this.rooms.set(roomId, room);

    return { room, player };
  }

  removePlayer(roomId: string, playerId: string): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    delete room.players[playerId];

    if (Object.keys(room.players).length === 0) {
      this.rooms.delete(roomId);
      return null;
    }

    if (room.hostId === playerId) {
      const playerIds = Object.keys(room.players);
      if (playerIds.length > 0) {
        room.hostId = playerIds[0];
        room.players[playerIds[0]].isHost = true;
      }
    }

    this.rooms.set(roomId, room);
    return room;
  }

  updateRoomPhase(roomId: string, phase: GamePhase): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.phase = phase;

    if (phase === 'giving-clues' && !room.startedAt) {
      room.startedAt = Date.now();
    }

    this.rooms.set(roomId, room);
    return room;
  }

  updateRoom(roomId: string, updates: Partial<Room>): Room | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const updatedRoom = { ...room, ...updates };
    this.rooms.set(roomId, updatedRoom);
    return updatedRoom;
  }

  deleteRoom(roomId: string): boolean {
    return this.rooms.delete(roomId);
  }

  cleanupOldRooms(maxAgeMs: number = 24 * 60 * 60 * 1000): number {
    const now = Date.now();
    let deletedCount = 0;

    for (const [roomId, room] of this.rooms.entries()) {
      if (now - room.createdAt > maxAgeMs) {
        this.rooms.delete(roomId);
        deletedCount++;
      }
    }

    return deletedCount;
  }
}

export const roomManager = new RoomManager();
