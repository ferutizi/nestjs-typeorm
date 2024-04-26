import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { DeleteResult } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) { }

  @Get()
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUse(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUser(id);
  }

  @Post()
  createUser(@Body() newUser: CreateUserDto): Promise<User> {
    return this.userService.createUser(newUser);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.userService.deleteUser(id)
  }
}
