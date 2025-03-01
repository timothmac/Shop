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
    console.log(createProductDto);
    const newProduct = this.productsRepository.create({
      ...createProductDto,
      category: { id: createProductDto.categoryId }, // явно устанавливаем связь
    });
    return this.productsRepository.save(newProduct);
  }
  

  async findAll(): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .select([
        "product.id",
        "product.name",
        "product.description",
        "product.price",
        "product.stock",
        "product.image",
        "category.id",
        "category.name"
      ])
      .getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['reviews', 'reviews.user'],
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
          user: { fullName: true },
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
    const query = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .select([
        'product.id',
        'product.name',
        'product.description',
        'product.price',
        'product.stock',
        'product.image',
        'product.categoryId',
        'category.id',
        'category.name'
      ]);
  
    if (name) {
      query.andWhere('LOWER(product.name) LIKE LOWER(:name)', { name: `%${name}%` });
    }
  
    // Применяем фильтр по категории только если categoryId передан и не равен "all"
    if (categoryId && categoryId !== "all") {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }
  
    return query.getMany();
  }
  
  
}
