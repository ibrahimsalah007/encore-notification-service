import type { Channel } from '../types/cli.type';

export function requireString(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${name} is required`);
  }
  return value;
}

export function parseChannel(value: unknown, name: string): Channel {
  const channel = requireString(value, name) as Channel;

  if (channel !== 'in_app' && channel !== 'email') {
    throw new Error(`${name} must be either in_app or email`);
  }
  
  return channel;
}

export function parsePositiveInt(value: unknown, name: string): number {
  const raw = requireString(value, name);
  const parsed = Number.parseInt(raw, 10);

  if (!Number.isFinite(parsed) || Number.isNaN(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsed;
}
