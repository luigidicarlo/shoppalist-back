import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { IAuthReq } from '../auth/interface/auth-req.interface';
import { ICreateList } from './dto/create-list.dto';
import { IUpdateList } from './dto/update-list.dto';
import { ListsService } from './lists.service';

@Controller('/lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @UseGuards(JwtGuard)
  @Get()
  async index(
    @Req() req: IAuthReq,
    @Query('page') page: string,
    @Query('perPage') perPage: string,
  ) {
    return this.listsService.index(req.user, Number(page), Number(perPage));
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  async show(@Req() req: IAuthReq, @Param('id') listId: string) {
    return this.listsService.show(req.user, listId);
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req: IAuthReq) {
    const body = req.body as ICreateList;
    return this.listsService.create(req.user, body);
  }

  @UseGuards(JwtGuard)
  @Patch('/:id')
  async update(@Req() req: IAuthReq, @Param('id') listId: string) {
    return this.listsService.update(req.user, listId, req.body as IUpdateList);
  }

  @UseGuards(JwtGuard)
  @Delete('/:id')
  async delete(@Req() req: IAuthReq, @Param('id') listId: string) {
    return this.listsService.delete(req.user, listId);
  }
}
