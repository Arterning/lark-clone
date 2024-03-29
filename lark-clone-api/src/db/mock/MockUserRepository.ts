import { User } from '../../user/entities/user.entity';

export class MockUserRepository {
  private readonly mockUsers: User[];

  constructor(mockUsers: User[]) {
    this.mockUsers = mockUsers;
  }

  find(): User[] {
    return this.mockUsers;
  }

  findOne(id: string): User {
    return this.mockUsers.find((user) => user.id === id);
  }
}
