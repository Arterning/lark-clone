import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoCommentRepository } from 'src/db/repositories/TodoCommentRepository';
import { TodoRepository } from 'src/db/repositories/TodoRepository';

@Module({
  imports: [TypeOrmModule.forFeature([TodoCommentRepository, TodoRepository])],
  controllers: [CommentController],
  providers: [CommentService]
})
export class CommentModule {}
