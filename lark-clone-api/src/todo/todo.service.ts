import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoStatus } from './entities/todo.entity';
import { TodoRepository } from '../db/repositories/TodoRepository';
import { UserRepository } from '../db/repositories/UserRepository';
import { FollowSaveType, FollowTodoDto } from './dto/follow-todo.dto';
import { User } from '../user/entities/user.entity';
import { TodoCommentRepository } from '../db/repositories/TodoCommentRepository';
import { QueryTodoDto } from './dto/query-todo.dto';
import { TodoComment } from '../comment/entities/comment.entity';

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
  async create(userId: string, createTodoDto: CreateTodoDto): Promise<Todo> {
    const user = await this.userRepository.findOne(userId);
    const { title, description, parentId } = createTodoDto;

    const todo = new Todo();
    todo.title = title;
    todo.description = description;
    todo.status = createTodoDto.status || TodoStatus.TODO;
    todo.createdBy = user;

    if (parentId) {
      const parent = await this.todoRepository.findOne(parentId);
      todo.parent = parent;
    }

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
    const qb = this.buildQuery({
      ...query,
      assignee: query.assignee || userId,
    });
    return qb.getMany();
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
    const user = await this.userRepository.findOne({
      relations: ['followingTodos'],
      where: { id: userId },
    });

    const followingTodos = user.followingTodos;

    if (!followingTodos || followingTodos.length === 0) {
      return [];
    }

    const qb = this.buildQuery(query);
    qb.andWhere('todo.id IN (:...ids)', {
      ids: followingTodos.map((todo) => todo.id),
    });

    return qb.getMany();
  }

  /**
   * 所有的任务
   * @param query
   * @returns
   */
  async findAllTodos(query: QueryTodoDto): Promise<Todo[]> {
    const qb = this.buildQuery(query);
    return qb.getMany();
  }

  /**
   * 用户创建的任务
   * @param userId
   * @returns
   */
  async findCreatedTodos(userId: string, query: QueryTodoDto): Promise<Todo[]> {
    const qb = this.buildQuery({
      ...query,
      createdBy: query.createdBy || userId,
    });
    return qb.getMany();
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
    const qb = this.buildQuery(query);
    if (!query.assignee) {
      qb.andWhere('todo.assignee IS NULL');
    }
    return qb.getMany();
  }

  /**
   * 已经完成的任务
   * @param userId
   * @returns
   */
  async findFinishedTodos(
    userId: string,
    query: QueryTodoDto,
  ): Promise<Todo[]> {
    const qb = this.buildQuery(query);
    qb.andWhere('todo.status = :status', { status: TodoStatus.DONE });
    return qb.getMany();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne(id, {
      where: { deletedAt: null },
      relations: ['createdBy', 'assignee', 'follower', 'comments', 'children'],
    });

    //get comment ids
    const comments = todo.comments;
    if (comments) {
      const commentIds = comments.map((comment) => comment.id);
      const todoComments = await this.commentRepository.findByIds(commentIds, {
        where: { deletedAt: null },
        relations: ['createdBy'],
        order: { createdAt: 'DESC' },
      });
      todo.comments = todoComments;
    }

    //get children ids
    const children = todo.children;
    if (children) {
      const childrenIds = children.map((child) => child.id);

      const todoChildren = await this.todoRepository.findByIds(childrenIds, {
        where: { deletedAt: null },
        relations: ['createdBy'],
        order: { createdAt: 'DESC' },
      });
      todo.children = todoChildren;
    }

    return todo;
  }

  /**
   * 更新任务
   * @param id
   * @param updateTodoDto
   * @returns
   */
  async update(id: string, updateTodoDto: UpdateTodoDto) {
    const { title, description, status, assignee } = updateTodoDto;

    let assigneeUser: User = null;

    if (assignee) {
      assigneeUser = await this.userRepository.findOne(assignee);
    }

    const todo = await this.todoRepository.findOne(id, {
      where: { deletedAt: null },
      relations: ['parent'],
    });

    if (!todo) {
      return;
    }

    const result = await this.todoRepository.update(id, {
      title,
      description,
      status: status || TodoStatus.TODO,
      assignee: assigneeUser,
      startDate: updateTodoDto.startDate
        ? new Date(updateTodoDto.startDate)
        : null,
      endDate: updateTodoDto.endDate ? new Date(updateTodoDto.endDate) : null,
    });

    const parent = todo.parent;
    if (!parent) {
      return result;
    }
    const parentId = parent.id;

    //check all childrens is done
    const childrens = await this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.deletedAt IS NULL')
      .andWhere('todo.parent = :parentId', { parentId: parentId })
      .getMany();

    if (childrens.length > 0) {
      const isAllDone = childrens.every(
        (child) => child.status === TodoStatus.DONE,
      );
      if (isAllDone) {
        await this.todoRepository.update(parentId, {
          status: TodoStatus.DONE,
        });
      }
    }

    return result;
  }

  /**
   * 创建评论
   * @param id
   * @param content
   * @returns
   */
  async createComment(requset, id: string, content: string) {
    const todo = await this.todoRepository.findOne(id, {
      where: { deletedAt: null },
    });

    if (!todo) {
      return;
    }

    const user = await this.userRepository.findOne(requset.user.id);
    const comment = new TodoComment();
    comment.content = content;
    comment.createdBy = user;
    comment.todo = todo;

    return this.commentRepository.save(comment);
  }

  async remove(id: string) {
    await this.todoRepository.update(id, { deletedAt: new Date() });
    //remove all children todos
    await this.todoRepository
      .createQueryBuilder('todo')
      .update(Todo)
      .set({ deletedAt: new Date() })
      .where('todo.parentId = :id', { id })
      .execute();
    return this.todoRepository.update(id, { deletedAt: new Date() });
  }

  buildQuery = (query: QueryTodoDto) => {
    const { sortBy, order, startDate, endDate, assignee, createdBy } = query;
    const qb = this.todoRepository
      .createQueryBuilder('todo')
      .where('todo.deletedAt IS NULL');
    if (createdBy) {
      qb.andWhere('todo.createdBy = :createdBy', { createdBy: createdBy });
    }

    if (assignee) {
      qb.andWhere('todo.assignee = :assignee', { assignee: assignee });
    }

    if (startDate) {
      qb.andWhere('todo.createdAt >= :startDate', { startDate: startDate });
    }

    if (endDate) {
      qb.andWhere('todo.createdAt <= :endDate', { endDate: endDate });
    }
    qb.orderBy(sortBy !== 'id' ? sortBy : 'todo.id', order);

    //left join the createdBy
    qb.leftJoinAndSelect('todo.createdBy', 'createdBy');
    return qb;
  };
}
