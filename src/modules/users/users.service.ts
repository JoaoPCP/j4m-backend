import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateUserDto) {
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    return await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
        cpf: dto.cpf,
      },
    });
  }

  async findOne(data: { id?: number; email?: string }): Promise<User> {
    const { id, email } = data;
    const conditions: object[] = [];
    if (id) conditions.push({ id });
    if (email) conditions.push({ email });
    const result = await this.prisma.user.findFirst({ where: { id } });
    if (!result) throw new Error();
    return result;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
