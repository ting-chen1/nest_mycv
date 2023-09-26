import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 使用 decorator 取得 session 資訊
// 但 decorator 並不能在 DI 系統中取用到 user repository，但 interceptor 可以
// 所以需要再做一個 interceptor 處理
// 課程原話
// Param decorators exist outside the DI system, so
// our decorator can't get an instance of UsersService directly.
export const CurrentUser = createParamDecorator(
  // data 是指任何傳入 decorator 的資訊
  // 對於 currentUser 來說，不希望傳入任何參數，所以型別設定成 never
  // 使用 currentUser 時， typescipt 就會檢查是否有參數，有的話就會顯示錯誤
  (data: never, context: ExecutionContext) => {
    // 為了取得 session 資訊需要使用 context 資訊
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
    // return 'hi there'; // previous demo
  },
);
