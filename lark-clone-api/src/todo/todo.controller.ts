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
    return this.todoService.findAllByUserId(id);
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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: string) {
    await this.todoService.remove(id);
    return { id };
  }
}
