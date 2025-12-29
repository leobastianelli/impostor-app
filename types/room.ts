import { Player } from './player';
import { Character } from './character';
import { Clue, Vote } from './game';

export type GamePhase =
  | 'lobby'
  | 'starting'
  | 'revealing'
  | 'giving-clues'
  | 'debating'
  | 'voting'
  | 'results';

export interface Room {
  id: string;
  code: string;
  hostId: string;
  phase: GamePhase;
  players: Record<string, Player>;
  maxPlayers: number;
  selectedCharacters: Character[];
  currentTurnPlayerId: string | null;
  clues: Clue[];
  votes: Vote[];
  winner: 'impostor' | 'group' | null;
  createdAt: number;
  startedAt: number | null;
}
