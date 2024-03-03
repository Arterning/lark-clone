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
import { QueryTodoDto } from './dto/query-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    private todoRepository: TodoRepository,
    private commentRepository: TodoCommentRepository,
    private userRepository: UserRepository,
  ) {}


  /**
   * 创建任务
   * @param userId 
   * @param createTodoDto 
   * @returns 
   */
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

  /**
   * 关注任务
   * @param userId
   * @param followTodoDto
   * @returns
   */
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

  /**
   * 所有的任务
   * @returns
   */
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

  /**
   * 用户负责的任务
   * @param userId
   * @param query
   * @returns
   */
  async findOwnedTodos(userId: string, query: QueryTodoDto): Promise<Todo[]> {
    const { sortBy, order, startDate, endDate, assignee, createdBy } = query;
    const todo = await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.createdBy = :createdBy', { createdBy: createdBy })
      .where('todo.startDate >= :startDate', { startDate })
      .where('todo.endDate <= :endDate', { endDate })
      .where('todo.deletedAt IS NULL')
      .where('todo.assignee = :assignee', { assignee: assignee || userId })
      .orderBy(sortBy, order)
      .getMany();
    return todo;
  }

  /**
   * 用户关注的任务
   * @param userId
   * @param query
   * @returns
   */
  async findFollowingTodos(
    userId: string,
    query: QueryTodoDto,
  ): Promise<Todo[]> {
    const { sortBy, order, startDate, endDate, assignee, createdBy } = query;
    const user = await this.userRepository.findOne({
      relations: ['followingTodos'],
      where: { id: userId },
    });
    return user ? user.followingTodos.filter((todo) => !todo.deletedAt) : [];
  }

  /**
   * 所有的任务
   * @param query
   * @returns
   */
  async findAllTodos(query: QueryTodoDto): Promise<Todo[]> {
    const { sortBy, order, startDate, endDate, assignee, createdBy } = query;
    const todo = await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.startDate >= :startDate', { startDate })
      .where('todo.endDate <= :endDate', { endDate })
      .where('todo.assignee = :assignee', { assignee: assignee })
      .where('todo.createdBy = :createdBy', { createdBy: createdBy })
      .where('todo.deletedAt IS NULL')
      .orderBy(sortBy, order)
      .getMany();
    return todo;
  }

  /**
   * 用户创建的任务
   * @param userId
   * @returns
   */
  async findCreatedTodos(userId: string, query: QueryTodoDto): Promise<Todo[]> {
    const { sortBy, order, startDate, endDate, assignee, createdBy } = query;
    const todo = await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.startDate >= :startDate', { startDate })
      .where('todo.endDate <= :endDate', { endDate })
      .where('todo.assignee = :assignee', { assignee: assignee })
      .where('todo.createdBy = :createdBy', { createdBy: createdBy || userId })
      .where('todo.deletedAt IS NULL')
      .orderBy(sortBy, order)
      .getMany();
    return todo;
  }

  /**
   * 用户分配的任务
   * @param userId
   * @returns
   */
  async findAssignedTodos(
    userId: string,
    query: QueryTodoDto,
  ): Promise<Todo[]> {
    const { sortBy, order, startDate, endDate, assignee, createdBy } = query;
    if (assignee) {
      return await this.todoRepository
        .createQueryBuilder('todo')
        .where('todo.startDate >= :startDate', { startDate })
        .where('todo.endDate <= :endDate', { endDate })
        .where('todo.createdBy = :createdBy', {
          createdBy: createdBy || userId,
        })
        .where('todo.deletedAt IS NULL')
        .where('todo.assignee = :assignee', { assignee: assignee })
        .orderBy(sortBy, order)
        .getMany();
    }
    return await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.startDate >= :startDate', { startDate })
      .where('todo.endDate <= :endDate', { endDate })
      .where('todo.createdBy = :createdBy', { createdBy: createdBy || userId })
      .where('todo.deletedAt IS NULL')
      .where('todo.assignee IS NOT NULL')
      .orderBy(sortBy, order)
      .getMany();
  }

  /**
   * 已经完成的任务
   * @param userId
   * @returns
   */
  async findFinishedTodos(userId: string, query: QueryTodoDto): Promise<Todo[]> {
    const { sortBy, order, startDate, endDate, assignee, createdBy } = query;
    const todo = await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.startDate >= :startDate', { startDate })
      .where('todo.endDate <= :endDate', { endDate })
      .where('todo.assignee = :assignee', { assignee: assignee })
      .where('todo.createdBy = :createdBy', { createdBy: createdBy })
      .where('todo.status = :status', { status: TodoStatus.DONE })
      .where('todo.deletedAt IS NULL')
      .orderBy(sortBy, order)
      .getMany();
    return todo;
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
    const { title, description, status, assignee } = updateTodoDto;

    let assigneeUser: User = null;

    if (assignee) {
      assigneeUser = await this.userRepository.findOne(assignee);
    }

    return this.todoRepository.update(id, {
      title,
      description,
      status: status || TodoStatus.TODO,
      assignee: assigneeUser,
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
