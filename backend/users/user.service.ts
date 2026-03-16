import type { CreateUserRequest, ListUsersQuery, ListUsersResponse, UserResponse } from './dto/users.dto';
import { UserPresenter } from './presenter/user.presenter';
import { UserRepository } from './user.repository';
import { hasNextPage, normalizeLimit, normalizePage } from '../lib/pagination';
import { APIError } from 'encore.dev/api';

export class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async createUser(payload: CreateUserRequest): Promise<UserResponse> {
    const normalizedName = payload.name?.trim();
    const normalizedEmail = payload.email?.trim();

    if (!normalizedName) {
      throw APIError.invalidArgument('User name is required');
    }

    if (!normalizedEmail) {
      throw APIError.invalidArgument('User email is required');
    }

    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (user) {
      throw APIError.alreadyExists('Email is already in use');
    }

    const createdUser = await this.userRepository.create({
      name: normalizedName,
      email: normalizedEmail,
    });

    return UserPresenter.toResponse(createdUser);
  }

  async listUsers(query: ListUsersQuery): Promise<ListUsersResponse> {
    const limit = normalizeLimit(query.limit);
    const page = normalizePage(query.page);

    const [rows, total] = await Promise.all([this.userRepository.list({ limit, page }), this.userRepository.count()]);

    return {
      items: UserPresenter.toResponseList(rows),
      total,
      limit,
      page,
      hasNextPage: hasNextPage(page, limit, total),
    };
  }

  async getUserById(id: string) {
    if (!id?.trim()) {
      throw APIError.invalidArgument('User id is required');
    }

    return this.userRepository.findById(id.trim());
  }
}
