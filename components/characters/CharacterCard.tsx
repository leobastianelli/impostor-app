'use client';

import { Character } from '@/types/character';

interface CharacterCardProps {
  character: Character;
  selected?: boolean;
  onSelect?: () => void;
  showDescription?: boolean;
}

export function CharacterCard({
  character,
  selected = false,
  onSelect,
  showDescription = true,
}: CharacterCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
        selected
          ? 'border-zinc-900 dark:border-zinc-50 bg-zinc-100 dark:bg-zinc-800'
          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
      }`}
      disabled={!onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
            {character.name}
          </h3>
          {showDescription && character.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {character.description}
            </p>
          )}
          {character.isCustom && (
            <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Personalizado
            </span>
          )}
        </div>
        {selected && (
          <div className="ml-3">
            <svg
              className="w-6 h-6 text-zinc-900 dark:text-zinc-50"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
