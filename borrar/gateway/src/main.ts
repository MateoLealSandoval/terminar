import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionsFilter } from './commont/axceptions/RpcExceptionsFilters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true
    })
  )
 
  app.enableCors({
    origin: '*', // Puedes cambiar '*' por el dominio de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.useGlobalFilters(new RpcCustomExceptionsFilter())
  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();
