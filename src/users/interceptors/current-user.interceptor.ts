import { NestInterceptor } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { CallHandler } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      request.currentUser = user;
      // 這裏將 user 資訊塞到 request.currentUser
      // 後續的 CurrentDecorator 可以直接從 request 取得 currentUser 資訊
    }

    return handler.handle();
  }
}
