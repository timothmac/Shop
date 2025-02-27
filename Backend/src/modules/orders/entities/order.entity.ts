import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-items.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum OrderStatus {
  PENDING = 'pending',
  SHIPPED = 'shipped',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CASH_ON_DELIVERY = 'cash_on_delivery',
  POSTPAID = 'postpaid',
}

export enum DeliveryMethod {
  COURIER = 'courier',
  PICKUP = 'pickup',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @Column('decimal')
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @Column()
  city: string;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: DeliveryMethod,
  })
  deliveryMethod: DeliveryMethod;

  // Новые поля для данных о пользователе
  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  comment?: string;

  // Добавляем поле даты создания
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
