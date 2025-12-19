import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule], // Garante acesso ao ConfigModule
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Pega a senha de forma segura
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService], // Injeta o serviço para ler o .env
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
