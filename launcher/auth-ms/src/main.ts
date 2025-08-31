import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AuthMicroservice');
  
  try {
    logger.log('Starting Auth Microservice...');
    logger.log(`NATS Servers: ${envs.natsServers}`);
    
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
        // Opciones adicionales para mejor conectividad
        reconnect: true,
        maxReconnectAttempts: 10,
        reconnectTimeWait: 2000,
        timeout: 10000,
      }
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    logger.log('Connecting to NATS...');
    await app.listen();
    logger.log('Auth Microservice connected to NATS successfully');
    
  } catch (error) {
    logger.error('Failed to start Auth Microservice:', error);
    process.exit(1);
  }
}

bootstrap();