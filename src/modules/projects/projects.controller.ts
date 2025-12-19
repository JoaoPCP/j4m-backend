import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('jams/:jamId/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post(':teamId')
  create(
    @Param('teamId') teamId: string,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    createProjectDto.teamId = +teamId;
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAllByJam(@Param('jamId') jamId: string) {
    return this.projectsService.findAllByJam(+jamId);
  }

  @Get(':id')
  findByTeam(@Param('id') id: string) {
    return this.projectsService.findbyTeam(+id);
  }
}
