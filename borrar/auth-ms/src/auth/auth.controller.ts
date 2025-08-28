import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginUserDto, RegisterPartnerDto, RegisterUserDto, SetStatusPartnerDto, setStatusUserDto } from './dto';
import { PaginationDto } from './commont/pagination.dto';
import { auhPathcNameDto } from './dto/authPathNames.dto';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern('auth-ms.patch.names.user')
  patchNameUsers(@Payload() patchName: auhPathcNameDto) {
    return this.authService.patchNames(patchName)
  }


  @MessagePattern('auth.register.user')
  registerUser(@Payload() RegisterUserDto: RegisterUserDto) {
    return this.authService.registerUser(RegisterUserDto)
  }
  @MessagePattern('auth.register.partner')
  registerPartner(@Payload() RegisterPartnerDto: RegisterPartnerDto) {
    return this.authService.registerPartner(RegisterPartnerDto)
  }
  @MessagePattern('auth.login.user')
  loginUser(@Payload() LoginUserDto: LoginUserDto) {
    return this.authService.LoginUser(LoginUserDto)
  }
  @MessagePattern('auth.verify.user')
  verifyUser(@Payload() token: string) {
    return this.authService.verifyToken(token)
  }

  @MessagePattern('auth.verify.user.data.token')
  refreshtoken(@Payload() token: string) {
    return this.authService.refreshtoken(token)
  }

 
  @MessagePattern('auth.get.basic.user.basic')
  basic_user_by_id(@Payload() { id }: { id: string }) {
    return this.authService.get_data_basic_user(id)
  }

  @MessagePattern('auth.verify.email.basic.user')
  verify_email_user(@Payload() { email }: { email: string }) {
    return this.authService.verifyUserEmail(email)
  }

  @MessagePattern('auth.reset.password.by.email')
  resetPasswordEmail(@Payload() { email, password }: { email: string, password: string }) {
    return this.authService.resetPassword(email, password)
  }

  /**
   * todo options admin
   * 
   *  
   */

  @MessagePattern('auth-ms.information.users.admin')
  get_information_users_admin(@Payload() { id }: { id: string }) {
    return this.authService.getInformationUsersAdmin(id);
  }

  @MessagePattern('auth-ms.create.user.superadmin')
  create_super_admin(RegisterUserDto: RegisterUserDto) {
    return this.authService.CreateSuperAdmin(RegisterUserDto)
  }
  @MessagePattern('auth-ms.get.all.partner.pagination.admin')
  get_all_partner_pagination_admin(@Payload() PaginationDto: PaginationDto) {

    return this.authService.getAllUsersPartners(PaginationDto);
  }
  @MessagePattern('auth-ms.get.all.user.pagination.admin')
  get_all_user_pagination_admin(@Payload() PaginationDto: PaginationDto) {
    return this.authService.getAllUsers(PaginationDto)
  }

  @MessagePattern('auth-ms.set.status.user.partner')
  set_status_user_partner(@Payload() SetStatusPartnerDto: SetStatusPartnerDto) {
    return this.authService.setStatusPartners(SetStatusPartnerDto)
  }
  @MessagePattern('auth-ms.set.status.user.admin')
  set_status_user_admin(@Payload() setStatusUserDto: setStatusUserDto) {
    return this.authService.setStatusUser(setStatusUserDto)
  }
}
