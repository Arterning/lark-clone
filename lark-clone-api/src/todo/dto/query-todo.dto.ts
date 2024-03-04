
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";


enum OrderType {
    ASC = "ASC",
    DESC = "DESC"
}

export class QueryTodoDto {

    /**
     * 按照什么字段排序
     */
    @IsString()
    @IsOptional()
    sortBy?: string;

    
    /**
     * 排序方式
     */
    @IsString()
    @IsOptional()
    order?: OrderType;


    /**
     * 开始时间
     */
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;
  
    /**
     * 结束时间
     */
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;


    /**
     * 创建人
     */
    @IsString()
    @IsOptional()
    createdBy?: string;


    /**
     * 任务人
     */
    @IsString()
    @IsOptional()
    assignee?: string;
}