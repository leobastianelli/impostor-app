import { Character } from './character';

export type PlayerRole = 'regular' | 'impostor';
export type PlayerStatus = 'waiting' | 'ready' | 'playing' | 'eliminated';

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  role: PlayerRole | null;
  assignedCharacter: Character | null;
  status: PlayerStatus;
  hasSubmittedClue: boolean;
  hasVoted: boolean;
  votedFor: string | null;
  joinedAt: number;
}
