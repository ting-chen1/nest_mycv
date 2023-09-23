import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';
// import { UserDto } from '../users/dto/user.dto'; // 範例暫時寫死 User DTO，後續會改用 constructor 處理

// interceptor 可用於 route, controller, global 層級
// 處理 request 與 reponse

// naming 慣例 xxxInterceptor
// export class CustomInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler)
//   function 名稱是固定的，當執行此 interceptor， intercept function 會自動執行

//   context: ExecutionContext 是 傳入的 request 資訊

//   next: CallHandler，接下來要執行的程序，實際上是一個 rxjs observable
//   在此可以視為後續 route 會執行的 function
// }


// 這裡的型別寫 any 時，使用區塊如果傳入 DTO 以外的資訊
// typescript 不會顯示錯誤，但實際運行會噴錯
// 至少要讓 dto 是 class 而非任意資訊
// export function Serialize(dto: any) {
//   return UseInterceptors(new SerializeInterceptor(dto));
// }

// 此 interface 代表的是任何 class
interface ClassConstructor {
  new (...args: any[]): {}
}
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
export class SerializeInterceptor implements NestInterceptor {
  // 可以用 implements class 或是 implements interface
  // implements 是將後方的 class 或 interface 內定義的方法或屬性套用到目標 class
  // typescript 會檢查目標 class 是否滿足套用的定義與屬性
  // 以此舉例， typescript 會檢查 SerializeInterceptor 內是否滿足 NestInterceptor 的設定
  // 在此會檢查 SerializeInterceptor 內是否定義 intercept 這個方法

  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // request 被 controller 處理前，這裡的程式會先執行
    // console.log('I am running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // response 傳出之前，這裡的程式會先執行
        // console.log('I am running before response is sent out', data);

        // plainToInstance 是將一般的 object 轉變成某個類別的實體
        // data 指的是 response 要送出得資訊，在此攔截下來做調整
        // excludeExtraneousValues: true
        // 表示除了標記在 DTO 裡要顯示的資訊，其他都要去除
        // 這樣是寫死 UserDto ，需要改成根據傳入的 DTO 做清洗
        // 這會需要寫 constructor 保留傳入的 DTO
        // return plainToInstance(UserDto, data, {
        //   excludeExtraneousValues: true,
        // })

        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        })
      }),
    );
  }
}
