import { Module } from '@nestjs/common';

// 將 main.ts ValidationPipe 設定移到 app.module
import { ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

// 將 session 設定移到 app.module
import { MiddlewareConsumer } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/users.entity';
import { Report } from './reports/reports.entity';

const cookieSession = require('cookie-session');
// cookie-session 與 typescript 有部分相容性問題
// 用 require 引入可以解決

// TypeOrmModule.forRoot. => 會分享到所有 module
// synchronize: true 的功能，只在開發環境使用，會去檢查所有 entities 並同步到資料庫
// 開發時，不用執行 migration
// 正式環境不可以使用
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          synchronize: true,
        }
      }
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    }
  ],
})
// 將 main.ts ValidationPipe 設定移到 app.module

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({ keys: ['asdfasdf'] })).forRoutes('*');
    // 將 session 設定移到 app.module
    // 每個 routes 都會先觸發 session middleware
  }
}