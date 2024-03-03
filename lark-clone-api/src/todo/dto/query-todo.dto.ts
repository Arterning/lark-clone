
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";


enum OrderType {
    ASC = "ASC",
    DESC = "DESC"
}

export class QueryTodoDto {

    @IsString()
    @IsOptional()
    sortBy?: string;

    @IsString()
    @IsOptional()
    order?: OrderType;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;
  
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;


    createdBy?: string;


    assignee?: string;
}