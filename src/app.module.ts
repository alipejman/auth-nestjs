import { Module } from '@nestjs/common';
import { customConfigModule } from './modules/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from './config/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    customConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmDbConfig,
      inject: [TypeOrmDbConfig]
    }),
    UserModule,
    AuthModule,
    JwtModule
  ],
  controllers: [],
  providers: [TypeOrmDbConfig],
})
export class AppModule {}
