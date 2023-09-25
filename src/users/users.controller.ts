import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  NotFoundException,
  // UseInterceptors,
  // ClassSerializerInterceptor
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
// 後續包成 decorator，可直接使用 decorator
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto) // 這樣是將此 interceptor 套用到整個 controller 上
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    // this.usersService.create(body.email, body.password); // 前期範例用
    return this.authService.signup(body.email, body.password) // 切換成 authService
  }

  @Post('/signin')
  signin(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
  }


  // ----------------------------------------------

  // 使用 nest 推薦的過濾器需要先在 entity 標記要去除的資訊
  // 去除資訊是通用規則的話可以此方法
  // 如果會根據不同情境排除不同資訊，這個方法就會出問題
  // @UseInterceptors(ClassSerializerInterceptor)
  // @Get(':id')
  // async findUser(@Param('id') id: string) {
  //    ........
  //    ........
  // }

  // 這是使用客製化的 interceptor
  // 可以避免預設 interceptor 使用 entity 設定 exclude 造成全域影響的問題
  // 在客製化的 interceptor 內設定該 route 需要處理的資料即可
  // @UseInterceptors(SerializeInterceptor) 當 interceptor 寫死的時候可以這樣使用
  // @Get(':id')
  // async findUser(@Param('id') id: string) {
  //    ........
  //    ........
  // }

  // 將 Dto 當參數傳給 interceptor 可以重複利用 interceptor，並做到 dependency injection
  // 這樣的寫法頗長，後續改寫成客製化 decorator，方便使用
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  // @Get(':id')
  // async findUser(@Param('id') id: string) {
  //    ........
  //    ........
  // }

  // 最終 interceptor 以 decorator 方式使用
  // Serialize 根據 DTO 決定資料清洗的情況
  // Serialize 可以用在單一 route 也可以用在整個 controller
  // @Serialize(UserDto)
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
