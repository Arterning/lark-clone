import { TodoStatus } from '../entities/todo.entity';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateTodoDto {
  @IsString()
  title: string; // 标题

  @IsString()
  @IsOptional()
  description?: string; // 具体内容

  @IsNumber()
  @IsOptional()
  status?: TodoStatus; // 状态

  @IsString()
  @IsOptional()
  assignee?: string; // 负责人

  @IsString()
  @IsOptional()
  parentId?: string; // 父任务

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

}
