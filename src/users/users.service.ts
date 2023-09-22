import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  // this part can be refactor as below code
  // repo: Repository<User>

  // constructor(repo: Repository<User>) {
  //   this.repo = repo
  // }
  // this part can be refactor as below code

  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  // private 是作為屬性的定義與賦值的縮寫

  // repo 的 型別註解是 Repository，並套用 User 這個通用型別
  // 通用型別(generic type)，是在定義宣告時不預先指定具體的型別，
  // 而是執行的時候才確認型別的特殊方式
  //
  // 簡言之，repo 會是一個 typeorm Repository 的實體，用於處理 User 的實體

  // InjectRepository 則是告知 DI 系統，這裡會用到 user repository
  // 這個修飾器只是因為 DI 系統與 通用型別相容不夠好，所以才需要使用

  // 這可以死記，其他用到 repository 的區塊就照做

  // for new user
  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    // 與 rails orm new 一樣，產出實體
    // 產出實體會經歷 entity 寫的驗證與 callback hook

    return this.repo.save(user);
    // 同 rails save
  }

  // 這種寫法就不會過驗證與 callback hook
  // create(email: string, password: string) {
  //   return this.repo.save({ email, password });
  // }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.findBy({ email });
  }

  // 這裡使用 Partial<User> 是因為 update 行為可能更新信箱，密碼，或者同時更新，需要彈性變化
  // 為什麼可以這樣使用， <User> 是指向 User entity， user entity 定義 id, email, password
  // Partial 是 typescript 提供的工具，讓型別判斷知道任何傳進來的 object 的都會有參照的一項或多種屬性
  async update(id: number, attributes: Partial<User>) {
    // 為了取得 user entity instance ，需要先透過 orm 去 database 查詢
    // 後續更新資料時，可以執行 hook or callback
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('user not found');
    }
    Object.assign(user, attributes);
    // 為了將 atrributes 的值依照對應的 key 填到 user
    // 與 rails assign_attributes 一樣

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('user not found');
    }

    return this.repo.remove(user);
  }
}
