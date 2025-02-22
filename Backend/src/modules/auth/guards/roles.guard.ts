import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from './roles.decorator';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      // Читаем роли, указанные в декораторе @Roles(...)
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles) {
        // Если декоратор @Roles не установлен, доступ открыт
        return true;
      }
  
      // Получаем пользователя из request (JWT Guard должен быть включен)
      const request = context.switchToHttp().getRequest();
      const user = request.user; // user.role должно быть записано при валидации JWT
      console.log(user)
      if (!user || !user.role) {
        throw new ForbiddenException('Недостаточно прав (нет user.role)');
      }
  
      // Проверяем, есть ли у пользователя роль, указанная в @Roles(...)
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Недостаточно прав для выполнения действия');
      }
      return true;
    }
  }
  