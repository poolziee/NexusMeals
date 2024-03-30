import { Injectable } from "@nestjs/common";

import { CreateOrderRequest } from "../../../libs/common/src/dto/create-order-request";

@Injectable()
export class OrdersService {
  getHello(): string {
    return "Hello World!";
  }

  createOrder(orderInfo: CreateOrderRequest) {
    // TODO: Save to database and emit event to products service.
    console.log("Order created:", orderInfo);
    return "Order created";
  }
}
