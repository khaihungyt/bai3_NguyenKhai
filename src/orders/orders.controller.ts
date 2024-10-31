import { Controller, Post, Body, Req, Get, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { request } from 'http';
import { Role } from 'src/users/entities/user.entity';
import { RoleGuard } from 'src/auth/role-guard';
import { JwtGuard } from 'src/auth/jwt.guard';
import * as jwt from "jsonwebtoken";
import { CreateOrderABookInput } from './dto/create-orderabook.input';
@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService) { }
    @Post()
    @UseGuards(JwtGuard, new RoleGuard(Role.CUSTOMER))
    async CreateOrderABook(
        @Body() createOrderDto: CreateOrderABookInput,
        @Req() req: Request) {
        let authorization = req.headers['authorization'];
        const token = authorization.split(" ")[1];
        if (token) {
            try {
                const user: any = jwt.verify(token, "Khaideptrai1972");
                return await this.orderService.createOrderABook(createOrderDto, user.userID);

            } catch (error) {
                throw new HttpException("Invalid Token: " + error.message, HttpStatus.UNAUTHORIZED)
            }
        }
    }
}
