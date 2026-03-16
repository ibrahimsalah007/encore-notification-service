export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface ListUsersQuery {
  limit?: number;
  page?: number;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ListUsersResponse {
  items: UserResponse[];
  total: number;
  limit: number;
  page: number;
  hasNextPage: boolean;
}
