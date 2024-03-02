import { User } from '../../src/user/entities/user.entity';
import { Todo } from '../../src/todo/entities/todo.entity';
import { ConnectionOptions } from 'typeorm/connection/ConnectionOptions';

const ormConfig: ConnectionOptions = {
  type: 'mysql',
  database: 'nest_todo',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '123456',
  entities: [User, Todo],
  logging: true,
};

export default ormConfig;
