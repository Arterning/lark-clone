import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { TodoModule } from '../src/todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user/entities/user.entity';
import { TodoComment } from '../src/comment/entities/comment.entity';
import { Todo, TodoStatus } from '../src/todo/entities/todo.entity';
import { AuthModule } from '../src/auth/auth.module';
import { TodoRepository } from '../src/db/repositories/TodoRepository';
import { UserRepository } from '../src/db/repositories/UserRepository';
import { CreateTodoDto } from '../src/todo/dto/create-todo.dto';
import { CommentModule } from '../src/comment/comment.module';
import { CreateCommentDto } from '../src/comment/dto/create-comment.dto';

describe('CommentController (e2e)', () => {
  const typeOrmModule = TypeOrmModule.forRoot({
    type: 'mysql',
    database: 'nest_todo',
    username: 'root',
    password: '123456',
    entities: [User, Todo, TodoComment],
  });
  let app: INestApplication;
  let bearerToken: string;
  let createdTodo: Todo;
  let createdComment: TodoComment;

  describe('suite name', () => {
    it('should pass', () => {
      expect(true).toBeTruthy();
    });
  });

  beforeAll(async (done) => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoModule, CommentModule, AuthModule, typeOrmModule],
      providers: [TodoRepository, UserRepository],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    // 生成测试用户的 token
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'user', password: 'user' })
      .expect(201)
      .expect((res) => {
        bearerToken = `Bearer ${res.body.token}`;
      })
      .end(done);
  });

  it('POST /todo', (done) => {
    const newTodo: CreateTodoDto = {
      title: 'todo99',
      description: 'desc99',
      status: TodoStatus.TODO,
    };

    request(app.getHttpServer())
      .post('/todo')
      .set('Authorization', bearerToken)
      .send(newTodo)
      .expect(201)
      .expect((res) => {
        createdTodo = res.body;
        expect(createdTodo.title).toEqual('todo99');
        expect(createdTodo.description).toEqual('desc99');
        expect(createdTodo.status).toEqual(TodoStatus.TODO);
      })
      .end(done);
  });

  it('POST /comment', (done) => {
    const newComment: CreateCommentDto = {
      content: 'comment99',
      todoId: createdTodo.id,
    };
    return request(app.getHttpServer())
      .post(`/comment`)
      .set('Authorization', bearerToken)
      .send(newComment)
      .expect(201)
      .expect((res) => {
        createdComment = res.body;
        expect(createdComment.content).toEqual('comment99');
      })
      .end(done);
  });

  it('GET /comment', (done) => {
    return request(app.getHttpServer())
      .get('/comment')
      .set('Authorization', bearerToken)
      .expect(200)
      .expect((res) => {
        expect(typeof res.body).toEqual('object');
        expect(res.body instanceof Array).toBeTruthy();
      })
      .end(done);
  });

  it('GET /comment/:id', (done) => {
    return request(app.getHttpServer())
      .get(`/comment/${createdComment.id}`)
      .set('Authorization', bearerToken)
      .expect(200)
      .expect((res) => {
        expect(res.body.content).toEqual(createdComment.content);
      })
      .end(done);
  });

  it('PATCH /comment/:id', (done) => {
    const updateComment = {
      content: 'newComment9999',
    };
    return request(app.getHttpServer())
      .patch(`/comment/${createdComment.id}`)
      .set('Authorization', bearerToken)
      .send(updateComment)
      .expect(200)
      .end(done);
  });

  it('DELETE /comment/:id', (done) => {
    return request(app.getHttpServer())
      .delete(`/comment/${createdComment.id}`)
      .set('Authorization', bearerToken)
      .expect(200)
      .end(done);
  });

  afterAll(async () => {
    await app.close();
  });
});
