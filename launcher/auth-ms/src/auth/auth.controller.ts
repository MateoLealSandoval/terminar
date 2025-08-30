import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  registerUser(@Payload() registerUserDto: any) {
    return this.authService.registerUser(registerUserDto);
  }

  @MessagePattern('auth.register.partner')
  registerPartner(@Payload() registerPartnerDto: any) {
    return this.authService.registerPartner(registerPartnerDto);
  }

  @MessagePattern('auth-ms.create.user.superadmin')
  createSuperAdmin(@Payload() registerUserDto: any) {
    return this.authService.CreateSuperAdmin(registerUserDto);
  }

  @MessagePattern('auth.login.user')
  loginUser(@Payload() loginUserDto: any) {
    return this.authService.LoginUser(loginUserDto);
  }

  @MessagePattern('auth.verify.user')
  verifyUser(@Payload() token: string) {
    return this.authService.verifyToken(token);
  }

  @MessagePattern('auth.verify.user.data.token')
  refreshtoken(@Payload() token: string) {
    return this.authService.verifyToken(token);
  }

  @MessagePattern('auth.get.basic.user.basic')
  basic_user_by_id(@Payload() { id }: { id: string }) {
    return this.authService.get_data_basic_user(id);
  }

  @MessagePattern('auth.verify.email.basic.user')

  @MessagePattern("auth-ms.information.users.admin")
  get_information_users_admin(@Payload() { id }: { id: string }) {
    return this.authService.getInformationUsersAdmin(id);
  }

  @MessagePattern("auth-ms.get.all.partner.pagination.admin")
  get_all_partner_pagination_admin(@Payload() PaginationDto: any) {
    return this.authService.getAllUsersPartners(PaginationDto);
  }

  @MessagePattern("auth-ms.get.all.user.pagination.admin")
  get_all_user_pagination_admin(@Payload() PaginationDto: any) {
    return this.authService.getAllUsers(PaginationDto);
  }
  verify_email_user(@Payload() { email }: { email: string }) {
    return this.authService.verifyUserEmail(email);
  }
}
