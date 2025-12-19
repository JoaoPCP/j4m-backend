import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TeamsModule } from '../teams/teams.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [TeamsModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService],
})
export class ProjectsModule {}
