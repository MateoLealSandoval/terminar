import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersFavoriteServices } from './services/users.favorites.service';
import { UsersFavoritesController } from './controllers/user.favorites.controller';
import { NatsModule } from './transport/nast.module';
 

@Module({
  imports:[NatsModule],
  controllers: [UsersController,UsersFavoritesController],
  providers: [UsersService,UsersFavoriteServices],
})
export class UsersModule {}
