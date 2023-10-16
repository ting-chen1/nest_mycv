// 簡略做法(非官方做法)
// 將 session 與 validation pipe 抽出
// 於 main.ts 與 e2e 設定，建立 app 實體後執行 setupApp（app）
// 即可於開發環境與測試環境執行 session 與 validation pipe 等 middleware
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');

export const setupApp = (app: any) => {
  app.use(
    cookieSession({
      keys: ['asdfasdf'],
    }),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
}