import { IsEmail, IsString } from 'class-validator';
// 要安裝 class-transformer class-validator
// npm install class-transformer class-validator

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
