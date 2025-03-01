import {
  IsString,
  IsNumber,
  IsInt,
  Min,
  IsOptional,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { v4 as uuidv4, validate as isUuid } from 'uuid';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: "Назва товару обов’язкова!" })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0, { message: "Ціна повинна бути 0 або більше!" })
  @IsNotEmpty({ message: "Ціна товару обов’язкова!" })
  price: number;

  @IsInt()
  @Min(0, { message: "Кількість на складі повинна бути 0 або більше!" })
  @IsOptional()
  stock?: number = 0;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNotEmpty({ message: "Категорія товару обов’язкова!" })
  @IsUUID("4", { message: "Невірний формат UUID для categoryId!" })
  @Transform(({ value }) => {
    // Если переданное значение не является корректным UUID, генерируем новый
    return isUuid(value) ? value : uuidv4();
  })
  categoryId: string;
}
