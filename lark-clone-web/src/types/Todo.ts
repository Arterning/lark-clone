import { User } from "./User";

export enum TodoStatus {
  TODO = 0, // 待完成
  DONE = 1, // 完成
}

export interface TodoItem {
  id?: string; // 自增 id
  title?: string; // 标题
  description?: string; // 具体内容
  status: TodoStatus; // 状态
  startDate?: Date;
  endDate?: Date;
  assignee?: User; // 分配任务的用户
  follower?: User[];// 关注任务的用户
  createdBy?: User; // 创建人
  updatedBy?: User; // 更新人
  createdAt?: Date; // 创建时间
  updatedAt?: Date; // 更新时间
  deletedAt?: Date;
}

export interface TodoComment {
  id: string; // 自增 id
  content?: string; // 内容
  createdBy?: User; // 创建人
  createdAt?: Date; // 创建时间
  updatedAt?: Date;
}