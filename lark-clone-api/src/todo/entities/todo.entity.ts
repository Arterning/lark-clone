import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { TodoComment } from './comment.entity';

export enum TodoStatus {
  TODO = 0, // 待完成
  DONE = 1, // 已经完成
}

@Entity()
@Tree('materialized-path')
export class Todo {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string; // 自增 id

  @ApiProperty()
  @Column({ length: 500 })
  title: string; // 标题

  @ApiProperty()
  @Column('text', { nullable: true })
  description?: string; // 具体内容

  @ApiProperty()
  @Column('int', { default: TodoStatus.TODO })
  status: TodoStatus; // 状态

  @ApiProperty()
  @Column({
    type: 'datetime',
    nullable: true,
  })
  startDate: Date;

  @ApiProperty()
  @Column({
    type: 'datetime',
    nullable: true,
  })
  endDate: Date;

  /**
   * 分配任务的用户
   */
  @ManyToOne(() => User, (user) => user.assignedTodos)
  assignee?: User;

  /**
   * 关注该任务的用户
   */
  @ManyToMany(() => User, (user) => user.followingTodos)
  @JoinTable()
  follower?: User[];

  @OneToMany(() => TodoComment, (comment) => comment.todo)
  comments: TodoComment[];

  @TreeParent({ onDelete: 'NO ACTION' })
  parent: Todo;

  @TreeChildren({ cascade: true })
  children: Todo[];

  @ManyToOne(() => User, (user) => user.createTodos)
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updateTodos)
  updatedBy: User;

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
