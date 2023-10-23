import { Report } from '../reports/reports.entity';
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { report } from 'process';
// import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude() // 使用前需要引入
  // 官方給的去除敏感資訊方法
  // 在 entity 需要隱藏的欄位標上 Exclude
  // 再到 controller 於該 route 使用 @UseInterceptors(ClassSerializerInterceptor)
  // 表示該 route 會過濾這些資訊
  password: string;

  // OneToMany 不會影響 database 欄位
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInser() {
    console.log('Inserted User with id', this.id);
  }

  @AfterUpdate()
  updateInser() {
    console.log('Updated User with id', this.id);
  }

  @AfterRemove()
  removeInser() {
    console.log('Removed User with id', this.id);
  }
}
