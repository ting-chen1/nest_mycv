import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _script } from 'crypto';
// randomBytes: 產生 加密用的鹽
// scrypt: 加密用
import { promisify } from 'util';
// promisify: 包裝 function 成為 promise function

const scrypt = promisify(_script);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // 確認 email 重複
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('email in user');
    }

    // hash the users password
    // 為了解決 rainbow attack 需要對密碼用 hash encript 與加鹽
    // generate salt
    const salt = randomBytes(8).toString('hex');
    // hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join salt and hash result
    const result = salt + '.' + hash.toString('hex');

    // create a new user and save it
    const user = await this.usersService.create(email, result);
    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    // 找到使用者
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    // 密碼結構 salt.hash
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    }

    return user;
  }
}
