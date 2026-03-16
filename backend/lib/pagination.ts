export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export function normalizeLimit(limit?: number): number {
  if (limit == null || Number.isNaN(limit) || limit < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(limit, MAX_LIMIT);
}

export function normalizePage(page?: number): number {
  if (page == null || Number.isNaN(page) || page < 1) {
    return 1;
  }

  return Math.floor(page);
}

export function toSqlOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function hasNextPage(page: number, limit: number, total: number): boolean {
  return page * limit < total;
}
