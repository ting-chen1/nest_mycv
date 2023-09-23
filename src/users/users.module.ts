import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

// TypeOrmModule.forFeature 會去掉用 forRoot 的設定，
// 但可以做出部分差異
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, AuthService],
})
export class UsersModule {}

// request -> validation pipe(DTO) -> controller -> service -> entity  -> repository

// repository -> entity -> service -> controller -> interceptor(DTO) -> response
