import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private userService: UsersService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context).getContext();
        const { username, password } = ctx.req.body.variables;
        const user: User = await this.userService.checklogin(username, password);
        if (user) {
            ctx.user = user;
            return true;
        } else {
            throw new HttpException("UnAuthenticated", HttpStatus.UNAUTHORIZED);
        }
    }

}