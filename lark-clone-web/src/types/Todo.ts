import { User } from "./User";

export enum TodoStatus {
  TODO = 0, // 待完成
  DONE = 1, // 完成
}

export interface TodoItem {
  id: number; // 自增 id
  title: string; // 标题
  description?: string; // 具体内容
  status: TodoStatus; // 状态
  startDate: Date;
  endDate: Date;
  createdBy: User; // 创建人
  updatedBy: User; // 更新人
  createdAt: Date; // 创建时间
  updatedAt: Date; // 更新时间
  deletedAt: Date;
}
