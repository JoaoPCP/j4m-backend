import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { J4msService } from './j4ms.service';
import { CreateJ4mDto } from './dto/create-j4m.dto';
import { UpdateJ4mDto } from './dto/update-j4m.dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';

@Controller('j4ms')
export class J4msController {
  constructor(private readonly j4msService: J4msService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createJ4mDto: CreateJ4mDto, @Request() req) {
    return this.j4msService.create(createJ4mDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.j4msService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.j4msService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJ4mDto: UpdateJ4mDto) {
    return this.j4msService.update(+id, updateJ4mDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.j4msService.remove(+id);
  }
}
