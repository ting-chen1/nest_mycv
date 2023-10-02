import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
// import { setupApp } from '../src/setup-app';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // setupApp(app);
    await app.init();
  });

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });

  // 未調整 main.js 或相關測試設置之前，這個測試會噴錯
  // 因為 nest 的的測試配置指導 module，session validation pipe 這些 middleware 未執行
  it('handles a signup request', () => {
    const email = 'fake_eamil@nextlink.com.tw'
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'fake_password' })
      .expect(201)
      .then((res) => {
        const id = res.body.id;
        const resEmail = res.body.email;
        expect(id).toBeDefined();
        expect(resEmail).toEqual(email);
      });
  });
});
