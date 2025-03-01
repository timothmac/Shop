import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    })
  }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto
  ) {
    console.log("Данные из Body:", JSON.stringify(createProductDto, null, 2)); // Вывод тела запроса
    
    if (file) {
   
      createProductDto.image = `/uploads/${file.filename}`;
    }
  
    console.log("Данные после добавления файла:", JSON.stringify(createProductDto, null, 2)); // Проверяем, добавился ли файл
    
    return this.productsService.create(createProductDto);
  }
  
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  search(@Query('name') name?: string, @Query('categoryId') categoryId?: string) {
    return this.productsService.search(name, categoryId);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    })
  }))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProductDto: UpdateProductDto
  ) {
    if (file) {
      updateProductDto.image = `/uploads/${file.filename}`;
    }
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
