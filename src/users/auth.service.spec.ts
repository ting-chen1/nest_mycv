import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from './users.entity';


it('can create an instance of auth service', async () => {
  // create a fake copy of the users service
  // 準備假個 UsersService，滿足
  // 定義 find 跟 create 是因為 AuthService #signin 只用到這兩個
  // Promise.resolve([]) 是建立出一個 promise 物件，之後馬上用參數執行 resolve 方法
  // fakeUserService 定義型別成 Partial<UsersService>
  // 是希望這個 object 的屬性與 UsersService 一樣
  // 內部定義個 function input output 型別一致，提高測試資料的正確性
  const fakeUserService: Partial<UsersService> = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
    // 型別太難定義則可以用 型別斷言強制設定
  }

  // 接著要欺騙 DI 系統，讓他使用下方定義的資訊生成 DI container
  // providers 紀錄的資訊是要注入到 DI container 的材料
  const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService, // 當有人需要取用 UsersService 時
          useValue: fakeUserService // 提供給他 fakeUserService
        }
      ]
  }).compile();

  // 使用 fakeUserService 的 DI container
  // 當測試 AuthService ＃signup 時
  // 裡面 usersService.find 跟 .create 會使用 fakeUserService 的 find 跟 create
  // 所以要調整測試資料時，就調整 fakeUserService 裡的方法
  const service = module.get(AuthService);

  expect(service).toBeDefined();
})