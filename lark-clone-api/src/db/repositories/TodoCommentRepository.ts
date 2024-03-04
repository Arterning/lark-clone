import { TodoComment } from '../../comment/entities/comment.entity';
import { EntityRepository, Repository, TreeRepository } from 'typeorm';

@EntityRepository(TodoComment)
export class TodoCommentRepository extends TreeRepository<TodoComment> {}
