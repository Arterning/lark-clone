import { ApiProperty } from '@nestjs/swagger';
import { Todo } from '../../todo/entities/todo.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TodoComment {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text')
  content: string;

  @ManyToOne(() => Todo, (todo) => todo.comments)
  todo: Todo;

  @ManyToOne(() => User, (user) => user.comments, {
    eager: true,
  })
  createdBy: User;

  @CreateDateColumn({
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    comment: '删除时间',
  })
  deletedAt: Date;
}
