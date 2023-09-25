import { CanActivate } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";

export class AuthGuard implements CanActivate {
  // context 在此就像是 http 應用程式裡傳進來的 request
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.session.userId;
    // session 有存 userId 就會傳出代表正向的資訊
    // 未存資訊則回傳 undefined 代表反向的資訊，此時會被 guard 擋下
  }
}