import { IsString } from "class-validator";

export class CreateCommentDto {

    @IsString()
    todoId: string;

    @IsString()
    content: string;
}
