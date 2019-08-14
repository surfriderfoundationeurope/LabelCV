import * as dotenv from 'dotenv';
import { ValidationPipe, Logger } from '@nestjs/common';

if (process.env.NODE_ENV !== 'production') {
  const result = dotenv.config();
  Logger.log('Configuration loaded from .env.', 'Main');
  Logger.log('Keys loaded from configuration: ' + Object.keys(result.parsed), 'Main' );
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';



async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
