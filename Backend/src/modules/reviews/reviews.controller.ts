
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Создать новый отзыв к продукту :productId
  @UseGuards(JwtAuthGuard)
  @Post(':productId')
  create(
    @Param('productId') productId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req,
  ) {
    // userId получаем из токена (req.user)
    const userId = req.user.id;
    return this.reviewsService.create(createReviewDto, userId, productId);
  }

  // Все отзывы (в целом по системе)
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  // Все отзывы для конкретного продукта
  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findByProduct(productId);
  }

  // Получить конкретный отзыв по его ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  // Обновить отзыв (при необходимости можно добавить Guard, чтобы обновлять мог только автор и/или админ)
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  // Удалить отзыв
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
