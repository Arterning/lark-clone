import { TodoStatus } from '../entities/todo.entity';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  title: string; // 标题

  @IsString()
  @IsOptional()
  description?: string; // 具体内容

  @IsNumber()
  status?: TodoStatus; // 状态

  @IsString()
  @IsOptional()
  media?: string;
}
