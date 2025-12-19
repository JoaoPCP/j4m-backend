import { Module } from '@nestjs/common';
import { J4msService } from './j4ms.service';
import { J4msController } from './j4ms.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [J4msController],
  providers: [J4msService, PrismaService],
})
export class J4msModule {}
