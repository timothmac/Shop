import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-items.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}


  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const { orderItems, totalPrice } = createOrderDto;


    const products = await this.productsRepository.findByIds(
      orderItems.map((item) => item.productId),
    );

    if (products.length !== orderItems.length) {
      throw new NotFoundException('Some products were not found');
    }


    const order = this.ordersRepository.create({
      user: { id: userId },
      totalPrice,
      status: OrderStatus.PENDING,
    });
    await this.ordersRepository.save(order);

    const savedOrderItems: OrderItem[] = [];
    for (const item of orderItems) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) continue;

      const orderItem = this.orderItemsRepository.create({
        order,
        product,
        quantity: item.quantity,
        price: item.price,
      });

      savedOrderItems.push(await this.orderItemsRepository.save(orderItem));
    }

    order.orderItems = savedOrderItems;
    return order;
  }


  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
  }


  async findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  // ==================================
  //   Получить один заказ (доступ
  //   только своему владельцу или
  //   менеджеру)
  // ==================================
  async findOne(id: string, user: User): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // Если роль не менеджер, пользователь может просматривать только свои заказы
    if (user.role !== 'manager' && order.user.id !== user.id) {
      throw new ForbiddenException('You do not have permission to view this order');
    }

    return order;
  }

  // ==================================
  //   Обновить заказ (только менеджер)
  // ==================================
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    // Загружаем заказ вместе с товарами
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    // Сохраняем старый статус, чтобы понимать логику изменения
    const oldStatus = order.status;
    const newStatus = updateOrderDto.status;

    // Применяем новые поля
    Object.assign(order, updateOrderDto);

    // Логика изменения количества продуктов на складе
    if (newStatus && newStatus !== oldStatus) {
      // Если переходим с "pending" на статус, отличный от "cancelled" —
      // списываем количество товаров (если ещё не списывали)
      if (
        oldStatus === OrderStatus.PENDING &&
        newStatus !== OrderStatus.CANCELLED
      ) {
        for (const item of order.orderItems) {
          const product = item.product;
          // Вычитаем количество из стока
          product.stock = product.stock - item.quantity;
          await this.productsRepository.save(product);
        }
      }

      // Если переходим в "cancelled" (а заказ был не pending),
      // возможно, возвращаем товары на склад.
      // (Это нужно только если вы уже успели списать их раньше.)
      if (
        oldStatus !== OrderStatus.PENDING &&
        newStatus === OrderStatus.CANCELLED
      ) {
        for (const item of order.orderItems) {
          const product = item.product;
          // Возвращаем количество обратно
          product.stock = product.stock + item.quantity;
          await this.productsRepository.save(product);
        }
      }
    }

    return this.ordersRepository.save(order);
  }

  // ==================================
  //   Удалить заказ (только менеджер)
  // ==================================
  async remove(id: string): Promise<{ message: string }> {
    const result = await this.ordersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return { message: `Order ${id} has been removed` };
  }
}
