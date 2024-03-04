import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FollowTodoDto } from './dto/follow-todo.dto';
import { QueryTodoDto } from './dto/query-todo.dto';
import { SkipJwtAuth } from '../auth/constants';

@ApiTags('待办事项')
@ApiBearerAuth()
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  /**
   * 创建任务
   * @param request
   * @param createTodoDto
   * @returns
   */
  @Post()
  async create(
    @Request() request,
    @Body() createTodoDto: CreateTodoDto,
  ): Promise<Todo> {
    return this.todoService.create(request.user.id, createTodoDto);
  }

  /**
   * 关注任务
   * @param request
   * @param followTodoDto
   * @returns
   */
  @Post('follow-todo')
  async followTodo(
    @Request() request,
    @Body() followTodoDto: FollowTodoDto,
  ): Promise<Todo> {
    const { id } = request.user;
    return this.todoService.followTodo(id, followTodoDto);
  }

  /**
   * 所有的任务
   * @param request
   * @returns
   */
  @Get('')
  @SkipJwtAuth()
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  /**
   * 用户负责的任务
   * @param request
   * @returns
   */
  @Post('owned')
  async findOwnedTodos(
    @Request() request,
    @Body() query: QueryTodoDto,
  ): Promise<Todo[]> {
    const { id } = request.user;
    return this.todoService.findOwnedTodos(id, query);
  }

  /**
   * 用户关注的任务
   * @param request
   * @returns
   */
  @Post('following')
  async findFollowingTodos(
    @Request() request,
    @Body() query: QueryTodoDto,
  ): Promise<Todo[]> {
    const { id } = request.user;
    return this.todoService.findFollowingTodos(id, query);
  }

  /**
   * 所有的任务
   * @param request
   * @returns
   */
  @Post('all')
  async findAllTodos(@Body() query: QueryTodoDto): Promise<Todo[]> {
    return this.todoService.findAllTodos(query);
  }

  /**
   * 用户创建的任务
   * @param request
   * @returns
   */
  @Post('created')
  async findCreatedTodos(
    @Request() request,
    @Body() query: QueryTodoDto,
  ): Promise<Todo[]> {
    const { id } = request.user;
    return this.todoService.findCreatedTodos(id, query);
  }

  /**
   * 用户分配的任务
   * @param request
   * @returns
   */
  @Post('assigned')
  async findAssignedTodos(
    @Request() request,
    @Body() query: QueryTodoDto,
  ): Promise<Todo[]> {
    const { id } = request.user;
    return this.todoService.findAssignedTodos(id, query);
  }

  /**
   * 已经完成的任务
   * @param request
   * @returns
   */
  @Post('finished')
  async findFinishedTodos(
    @Request() request,
    @Body() query: QueryTodoDto,
  ): Promise<Todo[]> {
    const { id } = request.user;
    return this.todoService.findFinishedTodos(id, query);
  }

  /**
   * 返回单个任务
   * @param id
   * @returns
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todo> {
    return this.todoService.findOne(id);
  }

  /**
   * 更新任务
   * @param id
   * @param updateTodoDto
   * @returns
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    await this.todoService.update(id, updateTodoDto);
    return updateTodoDto;
  }

  /**
   * 创建评论
   * @param id
   * @param content
   * @returns
   */
  @Post(':id/comment')
  async createComment(
    @Request() request,
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    return await this.todoService.createComment(request, id, content);
  }

  /**
   * 删除任务
   * @param id
   * @returns
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.todoService.remove(id);
    return { id };
  }
}
