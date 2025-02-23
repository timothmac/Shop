
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  
  async create(createReviewDto: CreateReviewDto, userId: string, productId: string): Promise<Review> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id=${userId} not found`);
    }

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with id=${productId} not found`);
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user,
      product,
    });
    return this.reviewRepository.save(review);
  }


  findAll(): Promise<Review[]> {
    return this.reviewRepository.find({ relations: ['user', 'product'] });
  }

 
  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
    if (!review) {
      throw new NotFoundException(`Review with id=${id} not found`);
    }
    return review;
  }

 
  async findByProduct(productId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { product: { id: productId } },
      relations: ['user', 'product'],
    });
  }

  
  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);
    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Review with id=${id} not found`);
    }
  }
}
