import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import {
  GetUserByIdDTO,
  CreateUserSchemaDTO,
  GetUserSchemaDTO,
  GetUserWithUserGroupsSchemaDTO
} from '@pro3/schemas'
import { UseZodGuard } from 'nestjs-zod'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<GetUserSchemaDTO[]> {
    return this.usersService.getAllUsers()
  }

  @Get(':id')
  @UseZodGuard('params', GetUserByIdDTO)
  async getById(@Param('id') userId: string): Promise<GetUserWithUserGroupsSchemaDTO> {
    return this.usersService.getById(userId)
  }

  @Post()
  @UseZodGuard('body', CreateUserSchemaDTO)
  async addUser(@Body() user: CreateUserSchemaDTO): Promise<GetUserSchemaDTO[]> {
    return this.usersService.addUser(user)
  }

  @Patch(':id')
  @UseZodGuard('params', GetUserByIdDTO)
  @UseZodGuard('body', CreateUserSchemaDTO)
  async updateUser(
    @Param('id') userId: string,
    @Body() user: CreateUserSchemaDTO
  ): Promise<Partial<GetUserSchemaDTO>> {
    return this.usersService.updateUser(userId, user)
  }

  @Delete(':id')
  @UseZodGuard('params', GetUserByIdDTO)
  async deleteUser(@Param('id') userId: string): Promise<Partial<GetUserSchemaDTO>> {
    return this.usersService.deleteUser(userId)
  }

  @Delete()
  async deleteAllUsers(): Promise<Partial<GetUserSchemaDTO>[]> {
    return this.usersService.deleteUsers()
  }

  @Get(':id/orders')
  @UseZodGuard('params', GetUserByIdDTO)
  async getUserOrders(@Param('id') userId: string) {
    return this.usersService.getUserOrders(userId)
  }
}
