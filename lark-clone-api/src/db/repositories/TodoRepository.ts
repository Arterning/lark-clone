import { EntityRepository, Repository, TreeRepository } from 'typeorm';
import { Todo } from '../../todo/entities/todo.entity';

@EntityRepository(Todo)
export class TodoRepository extends TreeRepository<Todo> {}
