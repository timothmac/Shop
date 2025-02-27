import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, DeliveryMethod } from '../entities/order.entity';

class OrderItemDto {
  @IsString()
  id: string; // идентификатор продукта

  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @Type(() => Number)
  price: number;
}

export class CreateOrderDto {
  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsEnum(DeliveryMethod)
  deliveryMethod: DeliveryMethod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @IsNumber()
  @Type(() => Number)
  totalPrice: number;
}
