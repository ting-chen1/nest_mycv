import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

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
