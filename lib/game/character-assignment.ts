import { Character } from '@/types/character';
import { Player, PlayerRole } from '@/types/player';

export interface CharacterAssignment {
  character: Character;
  role: PlayerRole;
}

export function assignCharactersAndImpostor(
  players: Player[],
  selectedCharacters: Character[]
): Map<string, CharacterAssignment> {
  if (players.length < 3) {
    throw new Error('Se necesitan al menos 3 jugadores');
  }

  if (selectedCharacters.length < 2) {
    throw new Error('Se necesitan al menos 2 personajes diferentes');
  }

  const groupCharacter = selectedCharacters[
    Math.floor(Math.random() * selectedCharacters.length)
  ];

  const impostorCharacterPool = selectedCharacters.filter(
    (c) => c.id !== groupCharacter.id
  );

  const impostorCharacter = impostorCharacterPool[
    Math.floor(Math.random() * impostorCharacterPool.length)
  ];

  const impostorIndex = Math.floor(Math.random() * players.length);

  const assignments = new Map<string, CharacterAssignment>();

  players.forEach((player, index) => {
    assignments.set(player.id, {
      character: index === impostorIndex ? impostorCharacter : groupCharacter,
      role: index === impostorIndex ? 'impostor' : 'regular',
    });
  });

  return assignments;
}

export function calculateVoteResults(
  players: Player[],
  votes: Map<string, string>
): {
  mostVotedPlayerId: string | null;
  voteCounts: Map<string, number>;
} {
  const voteCounts = new Map<string, number>();

  votes.forEach((targetId) => {
    voteCounts.set(targetId, (voteCounts.get(targetId) || 0) + 1);
  });

  let mostVotedPlayerId: string | null = null;
  let maxVotes = 0;

  voteCounts.forEach((count, playerId) => {
    if (count > maxVotes) {
      maxVotes = count;
      mostVotedPlayerId = playerId;
    }
  });

  return { mostVotedPlayerId, voteCounts };
}
