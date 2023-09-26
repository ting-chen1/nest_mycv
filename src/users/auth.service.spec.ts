import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// jest describe 同 rspec describe
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>

  // jest beforeEach 同 rspec before(:each)
  beforeEach(async () => {
    // create a fake copy of the users service
    // 準備假個 UsersService，滿足
    // 定義 find 跟 create 是因為 AuthService #signin 只用到這兩個
    // Promise.resolve([]) 是建立出一個 promise 物件，之後馬上用參數執行 resolve 方法
    // fakeUsersService 定義型別成 Partial<UsersService>
    // 是希望這個 object 的屬性與 UsersService 一樣
    // 內部定義個 function input output 型別一致，提高測試資料的正確性
    fakeUsersService = {
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
            useValue: fakeUsersService // 提供給他 fakeUsersService
          }
        ]
    }).compile();

    // 使用 fakeUsersService 的 DI container
    // 當測試 AuthService ＃signup 時
    // 裡面 usersService.find 跟 .create 會使用 fakeUsersService 的 find 跟 create
    // 所以要調整測試資料時，就調整 fakeUsersService 裡的方法
    service = module.get(AuthService);
    // 要給外部的 it 使用，所以變數設在外層，後續再賦值
  })

  // nest it 與 rspec it 相同
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
    // 因為 js 變數 scope 的原因，所以這裡可以取用到 外層的 service
  })

  describe('#signup', () => {
    it('creates a new user with a salted and hashed password', async () => {
      const password = '12345'
      const user = await service.signup('abc@abc.com', password)
      // 單純比對傳入的 password 與儲存的 password 是否一致
      expect(user.password).not.toEqual(password);
      const [salt, hash] = user.password.split('.');
      // 是否有加鹽
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    })

    it('throws an error if user signs up with email that is in use', async () => {
      // 直接複寫 fakeUsersService find function 來跳鞥測是資料
      // 這裡是模擬 find function 真的有從 database 查到一筆資料，後續就拋出錯誤
      let email = 'asdf@asdf.com'
      fakeUsersService.find = () => Promise.resolve([{ id: 1, email, password: '1' } as User]);

      await expect(service.signup(email, 'asdf')).rejects.toThrow(BadRequestException);
    });
  })

  describe('#signin', () => {
    it('throws if signin is called with an unused email', async () => {
      await expect(service.signin('fake_email@abc.com', 'asdf')).rejects.toThrow(NotFoundException);
    })
  })
})