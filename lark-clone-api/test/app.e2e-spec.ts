import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TodoModule } from '../src/todo/todo.module';
import { AuthModule } from '../src/auth/auth.module';
import { TodoRepository } from '../src/db/repositories/TodoRepository';
import { UserRepository } from '../src/db/repositories/UserRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/user/entities/user.entity';
import { Todo } from '../src/todo/entities/todo.entity';
import { AppModule } from '../src/app.module';
import { AppService } from '../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const typeOrmModule = TypeOrmModule.forRoot({
    type: 'mysql',
    database: 'nest_todo',
    username: 'root',
    password: '123456',
    entities: [User, Todo],
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoModule, AuthModule, typeOrmModule, AppModule],
      providers: [TodoRepository, UserRepository, AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/hello')
      .expect(200)
      .expect('Hello World!');
  });
});
