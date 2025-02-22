import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-items.entity';
import { Payment } from '../../payments/entities/payment.entity';

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

  @Column({ default: 'pending' })
  status: string;

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];
}
