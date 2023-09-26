import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from './users.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// 沒找到類似 rspec context 的 api，所以自己弄個 alias
let context = describe;
let target = describe;

// jest describe 同 rspec describe
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>

  // jest beforeEach 同 rspec before(:each)
  beforeEach(async () => {
    // v1 fakeUsersService
    // --------------------------------------------
    // create a fake copy of the users service
    // 準備假個 UsersService，滿足
    // 定義 find 跟 create 是因為 AuthService #signin 只用到這兩個
    // Promise.resolve([]) 是建立出一個 promise 物件，之後馬上用參數執行 resolve 方法
    // fakeUsersService 定義型別成 Partial<UsersService>
    // 是希望這個 object 的屬性與 UsersService 一樣
    // 內部定義個 function input output 型別一致，提高測試資料的正確性
    // fakeUsersService = {
    //   如果情境簡單可以種設計假資料
    //   find: () => Promise.resolve([]),
    //   create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
    //   // 型別太難定義則可以用 型別斷言強制設定
    // }
    // --------------------------------------------
    // v1 fakeUsersService

    // v2 fakeUsersService
    // --------------------------------------------
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email)
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: users.length + 1,
          email,
          password
        } as User
        users.push(user)
        return Promise.resolve(user)
      }
    }
    // --------------------------------------------
    // v2 fakeUsersService


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

  target('#signup', () => {
    context('create a new user', () => {
      it('password is salted and hashed', async () => {
        const password = '12345'
        const user = await service.signup('abc@abc.com', password)
        // 單純比對傳入的 password 與儲存的 password 是否一致
        expect(user.password).not.toEqual(password);
        const [salt, hash] = user.password.split('.');
        // 是否有加鹽
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
      })
    })

    context('signs up with used email', () => {
      it('throws an error', async () => {
        // 直接複寫 fakeUsersService find function 來跳鞥測是資料
        // 這裡是模擬 find function 真的有從 database 查到一筆資料，後續就拋出錯誤
        let email = 'asdf@asdf.com'
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email, password: '1' } as User]);

        await expect(service.signup(email, 'asdf')).rejects.toThrow(BadRequestException);
      });
    })
  })

  target('#signin', () => {
    context('with an unused email', () => {
      it('throws NotFoundException', async () => {
        await expect(service.signin('fake_email@abc.com', 'asdf')).rejects.toThrow(NotFoundException);
      })
    })

    context('with invalid password', () => {
      const email = 'asdf@asdf.com'

      // 與 rspec 不同，這些假資料設定必須寫在 beforeEach 或 it 裡才會執行
      // 但共用的變數還是要寫在外層，因為會被 scope 限制
      beforeEach(async () => {
        fakeUsersService.find = () => Promise.resolve([{ email, password: 'abc' } as User])
      })

      it('throws BadRequestException',async () => {
        await expect(service.signin(email, 'password')).rejects.toThrow(BadRequestException)
      })
    })

    context('correct email and password', () => {
      it('return a user',async () => {
        const email = 'correct_email@abc.com'
        const password = 'correct_password'

        // 使用 v1 fakeUsersService
        // --------------------------------------------
        // const encriptPassword = '0f280e7581bfabda.c6d8cba27eed00d7a15335b11c57ed6ea4b70422022a3fd82555bfb782e0d1e6'
        // fakeUsersService.find = () => Promise.resolve([{ email, password: encriptPassword } as User])
        // const user = await service.signin(email, password)
        // expect(user).toBeDefined()
        // const user = await service.signup(email, password)
        // console.log(user)
        // 這裡用 signup 取得加密過的密碼
        // --------------------------------------------
        // 使用 v1 fakeUsersService

        // 使用 v2 fakeUsersService
        await service.signup(email, password); // 透過 signup 建立的 user 會存在 users 陣列中
        const user = await service.signin(email, password); // signin 可以從 users 陣列中找 user
        expect(user).toBeDefined();
        // 使用 v2 fakeUsersService
      })
    })
  })
})