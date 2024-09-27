import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserInput } from './dto/login-user.input';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.checklogin(username, password);
        if (user) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        const { password, ...result } = user;
        return {
            access_token: this.jwtService.sign({
                user:result
            }),
            user
        }
    }

}
