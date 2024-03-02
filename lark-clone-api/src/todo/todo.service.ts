import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoStatus } from './entities/todo.entity';
import { TodoRepository } from '../db/repositories/TodoRepository';
import { UserRepository } from '../db/repositories/UserRepository';

@Injectable()
export class TodoService {
  constructor(
    private todoRepository: TodoRepository,
    private userRepository: UserRepository,
  ) {}

  async create(userId: number, createTodoDto: CreateTodoDto): Promise<Todo> {
    const user = await this.userRepository.findOne(userId);
    const { title, description } = createTodoDto;

    const todo = new Todo();
    todo.title = title;
    todo.description = description;
    todo.status = createTodoDto.status || TodoStatus.TODO;
    todo.createdBy = user;

    return this.todoRepository.save(todo);
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findAssignedTodos(userId: number): Promise<Todo[]> {
    const user = await this.userRepository.findOne({
      relations: ['assignedTodos'],
      where: { id: userId },
    });
    return user ? user.assignedTodos : [];
  }

  async findFinishedTodos(userId: number): Promise<Todo[]> {
    const user = await this.userRepository.findOne({
      relations: ['createTodos'],
      where: { id: userId },
    });

    const todos = user ? user.createTodos : [];

    return todos.filter((todo) => todo.status === TodoStatus.DONE);
  }

  async findAllByUserId(userId: number): Promise<Todo[]> {
    const user = await this.userRepository.findOne({
      relations: ['createTodos'],
      where: { id: userId },
    });

    return user ? user.createTodos : [];
  }

  async findFollowingTodos(userId: number): Promise<Todo[]> {
    const user = await this.userRepository.findOne({
      relations: ['followingTodos'],
      where: { id: userId },
    });
    return user ? user.followingTodos : [];
  }

  async findOne(id: string): Promise<Todo> {
    return this.todoRepository.findOne(id, {
      relations: [
        'createdBy',
        'assignee',
        'follower',
        'comments',
        'parent',
        'children',
      ],
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const { title, description, status } = updateTodoDto;

    return this.todoRepository.update(id, {
      title,
      description,
      status: status || TodoStatus.TODO,
    });
  }

  async remove(id: string) {
    return this.todoRepository.delete({
      id,
    });
  }
}
