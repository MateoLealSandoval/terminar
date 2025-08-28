import { Controller, Delete, Get, Inject, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ClientProxy, RpcException } from "@nestjs/microservices";
import { catchError, throwError } from "rxjs";
import { User } from "src/auth/decorator";
import { CurrentUser } from "src/auth/interfaces/current-user.interfaces";
import { PaginationDto } from "src/commont/pagination.dto";
import { NATS_SERVICE } from "src/config";
import { AuthGuard } from "src/guards/authGuards";

@Controller('favorites')
export class UsersFavoritesController {
    constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }



    @Post('create/:id')
    @UseGuards(AuthGuard)
    add_favorite(@User() user: CurrentUser, @Param('id') professionalId: string) {
        return this.client.send('add.favorites.user', {
            userId: user.id,
            ProfessionalId: professionalId
        }).pipe(
            catchError(error => {
                return throwError(() => new RpcException(error));
            })
        );
    }



    @UseGuards(AuthGuard)
    @Delete('/:id')
    GetUserData(@User() user: CurrentUser, @Param('id') professionalId: string) {
        return this.client.send('delete.favorites.user', {
            userId: user.id,
            ProfessionalId: professionalId
        }).pipe(
            catchError(error => {
                return throwError(() => new RpcException(error));
            })
        );
    }
    
    @UseGuards(AuthGuard)
    @Get('check/:id')
    CheckFavorite(@User() user: CurrentUser, @Param('id') professionalId: string) {
        return this.client.send('check.favorites.user', {
      
            ProfessionalId: professionalId,
            userId: user.id,
        }).pipe(
            catchError(error => {
                return throwError(() => new RpcException(error));
            })
        );
    }
    
    
    @UseGuards(AuthGuard)
    @Get()
    get_favorites(@User() user:CurrentUser , @Query() pagination: PaginationDto){
        
     
        return this.client.send('get.my.favorites.user', {
           ...pagination,
           idUser:user.id
        }).pipe(
            catchError(error => {
                return throwError(() => new RpcException(error));
            })
        );
    }
    

}

