import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Team, TeamMember } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class TeamsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async create(createTeamDto: CreateTeamDto, userId: number): Promise<Team> {
    const result = await this.prisma.team.create({
      data: {
        ...createTeamDto,
        createdById: userId,
        members: {
          create: {
            memberId: userId,
          },
        },
      },
      include: {
        members: true,
      },
    });

    return result;
  }

  async findAll(): Promise<Team[]> {
    const result = await this.prisma.team.findMany({
      include: {
        jam: { select: { name: true } },
        members: {
          include: { member: { select: { id: true, username: true } } },
        },
        creator: { select: { username: true, id: true } },
      },
    });
    return result;
  }

  async findOne(id: number): Promise<Team> {
    const result = await this.prisma.team.findUnique({
      where: { id },
      include: {
        jam: { select: { name: true } },
        members: {
          include: { member: { select: { id: true, username: true } } },
        },
        creator: { select: { username: true, id: true } },
      },
    });

    if (!result) throw new NotFoundException(`Team with ID ${id} not found`);
    return result;
  }

  async update(id: number, updateTeamDto: UpdateTeamDto): Promise<Team> {
    await this.findOne(id);

    const result = await this.prisma.team.update({
      where: { id },
      data: updateTeamDto,
    });
    return result;
  }

  async remove(id: number): Promise<{ id: number; name: string }> {
    await this.findOne(id);
    const { name: deletedTeamName } = await this.prisma.team.delete({
      where: { id },
      select: { name: true },
    });

    return { id, name: deletedTeamName };
  }

  async addMember(teamId: number, memberId: number): Promise<TeamMember> {
    await this.userService.findOne({ id: memberId });
    await this.findOne(teamId);
    const result = this.prisma.teamMember.create({
      data: { memberId, teamId },
      include: {
        member: { select: { id: true, username: true } },
        team: true,
      },
    });
    return result;
  }

  async removeMember(teamId: number, memberId: number): Promise<void> {
    const membership = await this.prisma.teamMember.findUnique({
      where: {
        teamId_memberId: {
          teamId,
          memberId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException(
        `Member with ID ${memberId} not found in team ${teamId}`,
      );
    }

    await this.prisma.teamMember.delete({
      where: {
        teamId_memberId: {
          teamId,
          memberId,
        },
      },
    });
  }

  async findUserTeam(userId: number, jamId: number): Promise<Team> {
    const team = await this.prisma.team.findFirst({
      where: {
        jamId: jamId,
        members: {
          some: {
            memberId: userId,
          },
        },
      },
      include: {
        jam: { select: { name: true } },
        members: {
          include: { member: { select: { id: true, username: true } } },
        },
        creator: { select: { username: true, id: true } },
      },
    });
    if (!team) throw new NotFoundException();
    return team;
  }
}
