import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { TodoCommentRepository } from '../db/repositories/TodoCommentRepository';
import { TodoComment } from './entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { TodoRepository } from '../db/repositories/TodoRepository';

@Injectable()
export class CommentService {

  constructor(private commentRepository: TodoCommentRepository,
    private todoRepository: TodoRepository) {}

  async create(userInfo: User, createCommentDto: CreateCommentDto): Promise<TodoComment> {

    const todo = await this.todoRepository.findOne(createCommentDto.todoId, {
      where: { deletedAt: null },
    });

    if (!todo) {
      return;
    }

    const comment = new TodoComment();
    comment.content = createCommentDto.content;
    comment.todo = todo;
    comment.createdBy = userInfo;
    return this.commentRepository.save(comment);
  }

  findAll(): Promise<TodoComment[]> {
    return this.commentRepository.find();
  }

  findOne(id: string): Promise<TodoComment> {
    return this.commentRepository.findOne(id);
  }

  update(id: string, updateCommentDto: UpdateCommentDto, userInfo) {
    return this.commentRepository.update(id, {
      ...updateCommentDto,
      createdBy: userInfo
    });
  }

  remove(id: string) {
    return this.commentRepository.update(id, { deletedAt: new Date() });
  }
}
