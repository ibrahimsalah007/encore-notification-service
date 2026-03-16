import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';

export function resolveApiUrl(cliApiUrl?: string): string {
  const fromCli = typeof cliApiUrl === 'string' ? cliApiUrl.trim() : '';
  const fromProcessEnv = (process.env.NOTIFY_API_URL ?? '').trim();
  const fromBunEnv = (typeof Bun !== 'undefined' ? (Bun.env.NOTIFY_API_URL ?? '') : '').trim();

  const raw = fromCli || fromProcessEnv || fromBunEnv;
  if (!raw) {
    throw new Error(
      'Missing API base URL. Provide `--api-url <url>`, set `NOTIFY_API_URL`, or create a `.env` file in the current directory with `NOTIFY_API_URL=...`.',
    );
  }

  const normalized = raw.replace(/\/+$/, '');
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error(`Invalid API base URL: ${JSON.stringify(raw)}. Expected an absolute URL like "http://localhost:4000".`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`Invalid API base URL protocol: ${JSON.stringify(parsed.protocol)}. Only http/https are supported.`);
  }

  return normalized;
}

export async function loadEnv(): Promise<void> {
  const cwdEnv = resolve(process.cwd(), '.env');

  if (await Bun.file(cwdEnv).exists()) {
    dotenv.config({ path: cwdEnv });
  }

  if (process.env.NOTIFY_API_URL) return;

  const exeDir = dirname(process.execPath);
  const parentOfExeDirEnv = resolve(exeDir, '..', '.env');
  
  if (parentOfExeDirEnv !== cwdEnv && (await Bun.file(parentOfExeDirEnv).exists())) {
    dotenv.config({ path: parentOfExeDirEnv });
  }
}
