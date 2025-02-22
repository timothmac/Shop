import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductsModule } from './modules/products/products.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { UsersModule } from './modules/users/users.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql', 
        host: configService.get('DATABASE_HOST'),
        port: Number(configService.get('DATABASE_PORT')),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/modules/**/entities/*.entity.{ts,js}'],
        synchronize: true, // В продакшене отключите!
        logging: true,
      }), 
    }),
    AdminModule,
    AuthModule,
    CartModule,
    CategoriesModule,
    OrdersModule,
    PaymentsModule,
    ProductsModule,
    ReviewsModule,
    UsersModule,
  ],
})
export class AppModule {}
