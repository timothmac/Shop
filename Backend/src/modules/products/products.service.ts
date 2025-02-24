import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productsRepository.create(createProductDto);
    return this.productsRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  
  // async findOne(id: string): Promise<Product> {
  //   const product = await this.productsRepository.findOne({
  //     where: { id },
  //     // Подгружаем:
  //     // - отзывы (reviews)
  //     // - пользователя (user), связанного с отзывом
  //     relations: ['reviews', 'reviews.user'],
  //   });
  
  //   if (!product) {
  //     throw new NotFoundException(`Product with id ${id} not found`);
  //   }
  
  //   return product;
  // }
  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['reviews', 'reviews.user'], // Загружаем только user.name
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        image: true,
        reviews: {
          id: true,
          rating: true,
          content: true,
          user: {
            fullName: true, 
          },
        },
      },
    });
  
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  
    return product;
  }
  

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }


  async remove(id: string): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }
  async search(name?: string, categoryId?: string): Promise<Product[]> {
    const query = this.productsRepository.createQueryBuilder('product');
   
    if (name) {
      query.andWhere('LOWER(product.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    return query.getMany();
  }

}
