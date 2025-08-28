import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { NatsModule } from 'src/transport/nast.module';
import { UsersFavoritesController } from './user.favorite.controller';


@Module({
  controllers: [UsersController,UsersFavoritesController],
  imports:[NatsModule],
})
export class UsersModule {}
