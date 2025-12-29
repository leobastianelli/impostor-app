import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

export function generateRoomCode(): string {
  return nanoid();
}

export function validateRoomCode(code: string): boolean {
  return /^[0-9A-Z]{6}$/.test(code);
}
