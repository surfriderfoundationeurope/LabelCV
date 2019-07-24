import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {

  const logger = new Logger('main');

  if (process.env.NODE_ENV !== 'production') {
    const result = dotenv.config();
    logger.log('Configuration loaded from .env.');
    logger.log('Keys loaded from configuration: ' + Object.keys(result.parsed) );
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.API_PORT || 3000);
}
bootstrap();
