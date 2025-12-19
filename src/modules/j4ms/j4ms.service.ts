import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJ4mDto } from './dto/create-j4m.dto';
import { UpdateJ4mDto } from './dto/update-j4m.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Jam } from '@prisma/client';

@Injectable()
export class J4msService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createJ4mDto: CreateJ4mDto, userId: number): Promise<Jam> {
    const result = await this.prisma.jam.create({
      data: { ...createJ4mDto, createdById: userId },
    });
    return result;
  }

  async findAll(): Promise<Jam[]> {
    const result = await this.prisma.jam.findMany({
      include: { author: { select: { username: true, id: true } } },
    });
    return result;
  }

  async findOne(id: number): Promise<Jam> {
    const result = await this.prisma.jam.findUnique({
      where: { id },
      include: { author: { select: { id: true, username: true } } },
    });
    if (!result) throw new NotFoundException();
    return result;
  }

  async update(id: number, updateJ4mDto: UpdateJ4mDto): Promise<Jam> {
    await this.findOne(id);
    const result = await this.prisma.jam.update({
      where: { id },
      data: updateJ4mDto,
    });
    return result;
  }

  async remove(id: number): Promise<{ id: number; name: string }> {
    await this.findOne(id);
    const { name: deletedJamName } = await this.prisma.jam.delete({
      where: { id },
      select: { name: true },
    });
    return { id, name: deletedJamName };
  }

  async findCreatedByUser(userId: number): Promise<Jam[]> {
    return this.prisma.jam.findMany({
      where: {
        createdById: userId,
      },
    });
  }
  async findParticipatingByUser(userId: number): Promise<Jam[]> {
    return this.prisma.jam.findMany({
      where: {
        teams: {
          some: {
            members: {
              some: {
                memberId: userId,
              },
            },
          },
        },
      },
    });
  }
}
