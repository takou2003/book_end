// src/users/users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<{
    success: boolean;
    count: number;
    data: User[];
    timestamp: string;
  }> {
    const users = await this.usersService.findAll();
    
    return {
      success: true,
      count: users.length,
      data: users,
      timestamp: new Date().toISOString(),
    };
  }
  
  @Get(':email')
  async findByEmail(@Param('email') email: string): Promise<{
    success: boolean;
    found: boolean;
    data: User | null;
    timestamp: string;
  }> {
    const users = await this.usersService.findByEmail(email);
    
    return {
      success: true,
      found: !!users,
      data: users,
      timestamp: new Date().toISOString(),
    };
  }

  @Post()
  async create(@Body() userData: any): Promise<{
    success: boolean;
    data: User;
    message: string;
  }> {
    const user = await this.usersService.create({
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      role: userData.role || 1,
    });
    
    return {
      success: true,
      data: user,
      message: 'User created successfully'
    };
  }
}
