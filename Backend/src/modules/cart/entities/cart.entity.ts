import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.cart, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, (product) => product.cart, { onDelete: 'CASCADE' })
  product: Product;

  @Column('int')
  quantity: number;

  @Column('decimal')
  totalPrice: number;
}
