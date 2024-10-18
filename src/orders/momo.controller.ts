import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { request } from 'http';

@Controller('momo')
export class MoMoController {
    constructor(private readonly orderService: OrdersService) { }
    @Post()
    handleIpn(@Body() payload: any) {
        console.log('IPN Received:', payload);
        // Xử lý dữ liệu nhận được từ MoMo
        // Ví dụ: lưu vào cơ sở dữ liệu hoặc cập nhật trạng thái giao dịch
        return { status: 'success' }; // Hoặc trả về bất kỳ thông điệp nào khác
    }
}
