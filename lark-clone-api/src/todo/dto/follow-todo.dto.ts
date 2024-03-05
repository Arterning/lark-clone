import { Optional } from "@nestjs/common";
import { IsEnum, IsString } from "class-validator";

export enum FollowSaveType {
    FOLLOW = 1,
    UN_FOLLOW = 0,
}


export class FollowTodoDto {

  @IsString()
  todoId: string;


  @Optional()
  @IsEnum(FollowSaveType)
  type: FollowSaveType;
  
}
