import { Controller, Post, Body, Get, Patch, Delete, Param, Query, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    // request 傳進來時，url 整體是一個字串，nest 不會自動解析成數字
    // /auth/123123 此時的 id 被視為 string
    // return this.usersService.findOne(parseInt(id))

    // with error
    const user = await this.usersService.findOne(parseInt(id));
    if(!user) {
      throw new NotFoundException('user not found')
    }
    return user
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  // update 同時有 url param, body param 所以要準備 dto
  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto
  ) {
    return this.usersService.update(parseInt(id), body)
  }
}
