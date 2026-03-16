import { api } from 'encore.dev/api';
import type { CreateUserRequest, ListUsersQuery, ListUsersResponse, UserResponse } from './dto/users.dto';
import { UserService } from './user.service';

const userService = new UserService();

export const createUser = api({ method: 'POST', path: '/users', expose: true }, async (req: CreateUserRequest): Promise<UserResponse> => {
  return userService.createUser(req);
});

export const listUsers = api({ method: 'GET', path: '/users', expose: true }, async (query: ListUsersQuery): Promise<ListUsersResponse> => {
  return userService.listUsers(query);
});
