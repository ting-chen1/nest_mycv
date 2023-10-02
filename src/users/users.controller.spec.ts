import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './users.entity';

const target = describe;
const context = describe;

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'abc@abc.com',
          password: 'password',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'password' } as User,
        ]);
      },
      // remove: () => {},
      // update: () => {}
    };
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      // signup: () => {},
      // signin: () => {}
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // controller test 並不會測到 decorator
  // decorator 會在 end to end test 測試
  target('findAllUsers', () => {
    context('find user with given email', () => {
      it('return users', async () => {
        const email = 'abc@abc.com';
        const users = await controller.findAllUsers(email);
        expect(users.length).toEqual(1);
        expect(users[0].email).toEqual(email);
      });
    });
  });

  target('findUser', () => {
    context('find user with given id', () => {
      it('return user', async () => {
        const user = await controller.findUser('1');
        expect(user).toBeDefined;
      });
    });

    context('fail to find user with given id', () => {
      it('throws and error', async () => {
        fakeUsersService.findOne = () => null;
        await expect(controller.findUser('1')).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  target('signin', () => {
    context('with correct email and password', () => {
      it('updates session object and returns user', async () => {
        const session = { userId: -10 };
        const user = await controller.signin(
          { email: 'asdf@asdf.com', password: 'asdf' },
          session,
        );

        expect(user.id).toEqual(1);
        expect(session.userId).toEqual(1);
      });
    });
  });
});
