import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderStatus } from '@app/common/dto';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
class OrderProduct {
  @Prop({ required: true })
  real_id: string;

  @Prop({ required: true })
  chefId: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

export const OrderProductSchema = SchemaFactory.createForClass(OrderProduct);

@Schema()
class OrderCustomer {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;
}

export const OrderCustomerSchema = SchemaFactory.createForClass(OrderCustomer);

@Schema()
class OrderChef {
  @Prop({ required: true })
  chefId: number;

  @Prop({ required: true })
  chefName: string;
}

export const OrderChefSchema = SchemaFactory.createForClass(OrderChef);

@Schema({ collection: 'orders', timestamps: true })
export class Order {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: OrderCustomerSchema, required: true })
  customer: OrderCustomer;

  @Prop({ type: OrderChefSchema, required: true })
  chef: OrderChef;

  @Prop({ type: [OrderProductSchema], required: true })
  products: OrderProduct[];

  @Prop({ type: String, enum: OrderStatus, required: true })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
