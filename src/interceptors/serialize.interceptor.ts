import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';

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

export class SerializeInterceptor implements NestInterceptor {
  // 可以用 implements class 或是 implements interface
  // implements 是將後方的 class 或 interface 內定義的方法或屬性套用到目標 class
  // typescript 會檢查目標 class 是否滿足套用的定義與屬性
  // 以此舉例， typescript 會檢查 SerializeInterceptor 內是否滿足 NestInterceptor 的設定
  // 在此會檢查 SerializeInterceptor 內是否定義 intercept 這個方法

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // request 被 controller 處理前，這裡的程式會先執行
    console.log('I am running before the handler', context);

    return handler.handle().pipe(
      map((data: any) => {
        // response 傳出之前，這裡的程式會先執行
        console.log('I am running before response is sent out', data);
      }),
    );
  }
}
