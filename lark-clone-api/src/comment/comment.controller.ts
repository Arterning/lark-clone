import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { TodoComment } from './entities/comment.entity';
import { CurrentUser } from '../roles/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('待办评论')
@ApiBearerAuth()
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @CurrentUser() userInfo,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<TodoComment> {
    return this.commentService.create(userInfo, createCommentDto);
  }

  @Get()
  findAll(): Promise<TodoComment[]> {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TodoComment> {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(
    @CurrentUser() userInfo,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, updateCommentDto, userInfo);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
