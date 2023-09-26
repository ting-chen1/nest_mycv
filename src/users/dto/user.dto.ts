import { Expose } from 'class-transformer';
// Expose 傳出此項資訊
// Exclude 不可傳出此項資訊

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: number;
}
