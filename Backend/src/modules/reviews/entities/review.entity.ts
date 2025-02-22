import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column('int', { default: 0 })
  rating: number;

  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, (product) => product.reviews, { onDelete: 'CASCADE' })
  product: Product;
}