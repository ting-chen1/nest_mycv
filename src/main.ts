import { NestFactory } from '@nestjs/core';
// import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// import { setupApp } from './setup-app';

// const cookieSession = require('cookie-session');
// cookie-session 與 typescript 有部分相容性問題
// 用 require 引入可以解決

// whitelist: true 的功能是去除未定義的參數
// 類似 rails params.permit(xxxxx)
// 只保留該路徑定義的 DTO 內參數
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // setupApp(app);

  // 為了使 middleware 正常執行於 e2e 測試環境
  // session 與 validation pipe 移到 app module 內設定
  // app.use(
  //   cookieSession({
  //     keys: ['asdfasdf'],
  //   }),
  // );
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
bootstrap();
