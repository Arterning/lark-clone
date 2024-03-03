import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FollowTodoDto } from './dto/follow-todo.dto';
import { User } from 'src/user/entities/user.entity';

@ApiTags('待办事项')
@ApiBearerAuth()
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

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
  async findAll(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  /**
   * 用户负责的任务
   * @param request
   * @returns
   */
  @Get('owned')
  async findOwnedTodos(@Request() request): Promise<Todo[]> {
    const { id } = request.user;
    return this.todoService.findAssignedTodos(id);
  }

  /**
   * 用户关注的任务
   * @param request
   * @returns
   */
  @Get('following')
  async findFollowingTodos(@Request() request): Promise<Todo[]> {
    const { id } = request.user;
    return this.todoService.findFollowingTodos(id);
  }

  /**
   * 所有的任务
   * @param request
   * @returns
   */
  @Get('all')
  async findAllTodos(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  /**
   * 用户创建的任务
   * @param request
   * @returns
   */
  @Get('created')
  async findCreatedTodos(@Request() request): Promise<Todo[]> {
    const { id } = request.user;
    return this.todoService.findAllByUserId(id);
  }

  /**
   * 用户分配的任务
   * @param request
   * @returns
   */
  @Get('assigned')
  async findAssignedTodos(@Request() request): Promise<Todo[]> {
    const { id } = request.user;
    return this.todoService.findAssignedTodosByUserId(id);
  }

  /**
   * 已经完成的任务
   * @param request
   * @returns
   */
  @Get('finished')
  async findFinishedTodos(@Request() request): Promise<Todo[]> {
    const { id } = request.user;
    return this.todoService.findFinishedTodos(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todo> {
    return this.todoService.findOne(id);
  }

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
  @Post(":id/comment")
  async createComment(@Param('id') id: string, @Body('content') content: string) {
    return await this.todoService.createComment(id, content);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.todoService.remove(id);
    return { id };
  }
}
