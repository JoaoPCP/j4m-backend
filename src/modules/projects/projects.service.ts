import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Project } from '@prisma/client';
import { TeamsService } from '../teams/teams.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly teamsService: TeamsService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    await this.teamsService.findOne(createProjectDto.teamId);
    const alreadySubmitted = await this.findbyTeam(createProjectDto.teamId);
    if (alreadySubmitted) {
      throw new ConflictException();
    }
    const result = await this.prisma.project.create({
      data: createProjectDto,
    });
    return result;
  }

  async findAllByJam(jamId: number): Promise<Project[]> {
    const result = await this.prisma.project.findMany({
      where: {
        team: {
          jamId: jamId,
        },
      },
      include: {
        team: {
          select: { name: true, id: true },
        },
      },
    });
    return result;
  }

  async findbyTeam(id: number): Promise<Project> {
    const result = await this.prisma.project.findUnique({
      where: { teamId: id },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            creator: { select: { username: true } },
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return result;
  }
}
