import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthGuard } from './auth.guard';
import { JwtGuard } from './jwt.guard';
import { RoleGuard } from './role-guard';

@Module({
  providers: [AuthService, AuthResolver, LocalStrategy, JwtStrategy, AuthGuard, JwtGuard, RoleGuard],
  imports: [PassportModule, UsersModule, JwtModule.register({
    signOptions: { expiresIn: '600s' },
    secret: 'Khaideptrai1972',
  })],
})
export class AuthModule { }
