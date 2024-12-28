import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config';
import * as dotenv from 'dotenv';
async function bootstrap() {
  dotenv.config();
  console.log('Environment Variables:', process.env);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport:Transport.TCP,
    options: {
      host: "0.0.0.0", // Asegura que tengas un valor por defecto
      port: envs.port , // Valor por defecto si la variable no está definida
    },
    
  });
 

 
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  await app.listen();

  console.log(`Microservicio en puerto ${envs.port}`)
  
}
bootstrap();

