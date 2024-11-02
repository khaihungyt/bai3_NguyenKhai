import { Controller, Post, Body, Req, Get, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { request } from 'http';
import { Role } from 'src/users/entities/user.entity';
import { RoleGuard } from 'src/auth/role-guard';
import { JwtGuard } from 'src/auth/jwt.guard';
import * as jwt from "jsonwebtoken";
import { CreateOrderABookInput } from './dto/create-orderabook.input';
import * as AsyncLock from 'async-lock';
@Controller('orders')
export class OrdersController {
    private lock: AsyncLock;
    constructor(private readonly orderService: OrdersService) {
        this.lock = new AsyncLock();
    }
    @Post()
    // @UseGuards(JwtGuard, new RoleGuard(Role.CUSTOMER))
    async CreateOrderABook(
        @Body() createOrderDto: CreateOrderABookInput,
        @Req() req: Request) {
        // return await this.lock.acquire("resource-key", async () => {
        //let authorization = req.headers['authorization'];
        //const token = authorization.split(" ")[1];
        //if (token) {
        try {
            //const user: any = jwt.verify(token, "Khaideptrai1972");
            return await this.orderService.createOrderABook(createOrderDto, "df1f04b4-ef20-489f-af28-c4a805404642");
        } catch (error) {
            throw new HttpException("Invalid Token: " + error.message, HttpStatus.UNAUTHORIZED)
        }
        //  }
        // });
    }
}
