import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import { TodoComment } from 'src/todo/entities/comment.entity';

@EntityRepository(TodoComment)
export class TodoCommentRepository extends TreeRepository<TodoComment> {}
