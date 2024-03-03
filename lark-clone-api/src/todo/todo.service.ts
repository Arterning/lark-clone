import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoStatus } from './entities/todo.entity';
import { TodoRepository } from '../db/repositories/TodoRepository';
import { UserRepository } from '../db/repositories/UserRepository';
import { FollowSaveType, FollowTodoDto } from './dto/follow-todo.dto';
import { User } from 'src/user/entities/user.entity';
import { TodoComment } from './entities/comment.entity';
import { TodoCommentRepository } from 'src/db/repositories/TodoCommentRepository';

@Injectable()
export class TodoService {
  constructor(
    private todoRepository: TodoRepository,
    private commentRepository: TodoCommentRepository,
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

  async followTodo(
    userId: string,
    followTodoDto: FollowTodoDto,
  ): Promise<Todo> {
    const { todoId, type = FollowSaveType.FOLLOW } = followTodoDto;
    console.log('userId', userId);

    const todo = await this.todoRepository.findOne(todoId);

    if (!todo || !userId) {
      return;
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['followingTodos'],
    });

    const followingTodos = user.followingTodos;

    const index = followingTodos.findIndex((item) => item.id === todo.id);
    if (index === -1) {
      if (type === FollowSaveType.UN_FOLLOW) {
        return;
      }
      followingTodos.push(todo);
    } else {
      if (type === FollowSaveType.FOLLOW) {
        return;
      }
      followingTodos.splice(index, 1);
    }
    user.followingTodos = followingTodos;
    await this.userRepository.save(user);

    return todo;
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find({
      where: {
        deletedAt: null,
      },
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
    // filter out deleted
    return user ? user.assignedTodos.filter((todo) => !todo.deletedAt) : [];
  }

  async findFinishedTodos(userId: number): Promise<Todo[]> {
    const user = await this.userRepository.findOne({
      relations: ['createTodos'],
      where: { id: userId },
    });

    const todos = user ? user.createTodos : [];

    return todos.filter(
      (todo) => todo.status === TodoStatus.DONE && !todo.deletedAt,
    );
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
    return user ? user.followingTodos.filter((todo) => !todo.deletedAt) : [];
  }

  async findOne(id: string): Promise<Todo> {
    return this.todoRepository.findOne(id, {
      where: { deletedAt: null },
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
      assignee: updateTodoDto.assignee ? { id: updateTodoDto.assignee } : null,
      startDate: updateTodoDto.startDate
        ? new Date(updateTodoDto.startDate)
        : null,
      endDate: updateTodoDto.endDate ? new Date(updateTodoDto.endDate) : null,
    });
  }

  /**
   * 创建评论
   * @param id
   * @param content
   * @returns
   */
  async createComment(id: string, content: string) {
    const todo = await this.todoRepository.findOne(id, {
      where: { deletedAt: null },
    });

    if (!todo) {
      return;
    }

    const comment = new TodoComment();
    comment.content = content;
    comment.todo = todo;

    return this.commentRepository.save(comment);
  }

  async remove(id: string) {
    return this.todoRepository.update(id, { deletedAt: new Date() });
  }
}
