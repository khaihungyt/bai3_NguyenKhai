import { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable } from "rxjs";


export class RoleGuard implements CanActivate {
    public role: string;
    constructor(role: string) {
        this.role = role;
    }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = GqlExecutionContext.create(context).getContext();
        const user = ctx.user;
        if (user.role === this.role) {
            return true;
        }
        return false;
    }
}