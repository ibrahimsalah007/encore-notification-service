import type { UserResponse, UserRow } from '../dto/users.dto';

export class UserPresenter {
  static toResponse(row: UserRow): UserResponse {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: row.created_at.toISOString(),
    };
  }

  static toResponseList(rows: UserRow[]): UserResponse[] {
    return rows.map(UserPresenter.toResponse);
  }
}
