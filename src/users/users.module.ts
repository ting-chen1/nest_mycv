import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

// TypeOrmModule.forFeature 會去掉用 forRoot 的設定，
// 但可以做出部分差異
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CurrentUserInterceptor,
    },
    // 要全域使用 CurrentUserInterceptor 時
    // provide 需明確指定提供到全域的 interceptor
    // 再指定提供的是哪個 class
    // 缺點是部分 controller 或 route 不需要使用 currentUser 也會執行此程式
  ],
  // providers: [UsersService, AuthService, CurrentUserInterceptor], // 基本寫法
})
export class UsersModule {}

// request -> validation pipe(DTO) -> controller -> service -> entity  -> repository

// repository -> entity -> service -> controller -> interceptor(DTO) -> response
