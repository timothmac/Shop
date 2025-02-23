import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}


  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(newCategory);
  }


  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({ relations: ['products'] }); // загружаем продукты в категории
  }


  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

 
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }


  async remove(id: string): Promise<void> {
    const result = await this.categoriesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
  }
}
