import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from '../user/entities/user.entity';
import { OTPEntity } from '../user/entities/otp.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([
    UserEntity,
    OTPEntity
  ]),
],
  controllers: [AuthController],
  providers: [AuthService
  ],
})
export class AuthModule {}
