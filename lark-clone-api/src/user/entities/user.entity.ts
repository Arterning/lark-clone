import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Todo } from '../../todo/entities/todo.entity';
import { TodoComment } from '../../comment/entities/comment.entity';

@Entity()
export class User {
  @ApiProperty({ description: '自增 id' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '标题' })
  @Column({ length: 500 })
  username: string;

  @ApiProperty({ description: '密码' })
  @Exclude()
  @Column({ length: 500 })
  password: string;

  @ApiProperty({ description: '邮箱' })
  @Column({ length: 500, default: '' })
  email?: string;

  @ApiProperty({ description: '是否为管理员' })
  @Column('int', { default: 0 })
  is_admin?: number;

  @OneToMany(() => Todo, (todo) => todo.createdBy, { cascade: true })
  createTodos: Todo[];

  @OneToMany(() => Todo, (todo) => todo.updatedBy, { cascade: true })
  updateTodos: Todo[];

  @OneToMany(() => TodoComment, (comment) => comment.createdBy, {
    cascade: true,
  })
  comments: TodoComment[];

  @OneToMany(() => Todo, (todo) => todo.assignee, { cascade: true })
  assignedTodos: Todo[];

  @ManyToMany(() => Todo, (todo) => todo.follower, { cascade: true })
  followingTodos: Todo[];

  @BeforeInsert()
  private async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}
