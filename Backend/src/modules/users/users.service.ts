import { Injectable, NotFoundException, ConflictException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Ініціалізація модуля, створення адміністратора, якщо його немає.
   */
  async onModuleInit() {
    await this.createAdminIfNotExists();
  }

  /**
   * Перевіряє, чи є адміністратор у базі даних, якщо немає — створює.
   */
  private async createAdminIfNotExists() {
    const existingAdmin = await this.usersRepository.findOne({ where: { role: 'admin' } });

    if (!existingAdmin) {
      const adminPassword = 'admin123'; // Пароль за замовчуванням
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const adminUser = this.usersRepository.create({
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        fullName: 'Адміністратор',
        city: 'Київ',
        phoneNumber: '+380501234567',
      });

      await this.usersRepository.save(adminUser);
      console.log('✅ Адміністратор створений: admin@example.com / Пароль: admin123');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('Email уже використовується');
    }
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Користувача з id ${id} не знайдено`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<{ user: User; accessToken: string }> {
    if (updateUserDto.email) {
      const existingUser = await this.usersRepository.findOne({ where: { email: updateUserDto.email } });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email уже використовується');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    await this.usersRepository.update(id, updateUserDto);
    const user = await this.findOne(id);
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    return { user, accessToken };
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
