import { Controller } from "@nestjs/common"
import { MessagePattern, Payload } from "@nestjs/microservices"
import { UsersFavoriteServices } from "../services/users.favorites.service"
import { Favorites_dto } from "../dto/Favorites/Favorites.dto"
import { pagination_favorites } from "../dto/Favorites/Get.favorites.dto"

@Controller()
export class UsersFavoritesController {
  constructor(private readonly usersServiceFavorites: UsersFavoriteServices) {}

  @MessagePattern( 'add.favorites.user')
  create_favorite_controller(@Payload() create_favorite:Favorites_dto){
    return this.usersServiceFavorites.create_favorite(create_favorite)
  }
  @MessagePattern( 'delete.favorites.user')
  delete_favorite_controller(@Payload() delete_favorite:Favorites_dto){
    return this.usersServiceFavorites.delete_favorite(delete_favorite)
  }
 
  @MessagePattern('get.my.favorites.user')
  get_favorites_user_controller(@Payload() pagination_favorites:pagination_favorites){
 
    return this.usersServiceFavorites.get_favorites(pagination_favorites)
 
  }
  @MessagePattern('check.favorites.user')
  check_favorites_user_controller(@Payload() favorite_req:Favorites_dto){
 
    return this.usersServiceFavorites.check_user_favorite(favorite_req)
 
  }
}
