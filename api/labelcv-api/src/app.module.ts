import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageModule } from './images/image.module';
import { AzureStorageModule } from '@nestjs/azure-storage';

@Module({
  imports: [
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
