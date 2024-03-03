import { Optional } from "@nestjs/common";
import { IsString } from "class-validator";

export enum FollowSaveType {
    FOLLOW = 0,
    UN_FOLLOW = 1,
}


export class FollowTodoDto {

  @IsString()
  todoId: string;


  @Optional()
  type: FollowSaveType = FollowSaveType.FOLLOW;
}
