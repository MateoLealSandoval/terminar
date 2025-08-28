import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from '../services/users.service';
import { CreateUserDataDto } from '../dto/userData';
import { CurrentUser } from '../interfaces/current-user.interfaces';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern( 'user.example.user')
  registerUser(){
    return this.usersService.exampleUserdata()
  }
 
  @MessagePattern('User.CreateUserData.User')
  createdatabasic(@Payload() CreateUserDataDto:CreateUserDataDto){
    return this.usersService.createUserData(CreateUserDataDto)
  }
  @MessagePattern('User.GetDataUser.User')
  GetLocationsUser(@Payload() CurrentUser:CurrentUser ){
    return this.usersService.GetUserData(CurrentUser)
  }

  @MessagePattern('User.id.data.User')
  Get_data_user_id(@Payload() { id }: { id: string } ){
    return this.usersService.get_user_by_id(id)
  }
}
