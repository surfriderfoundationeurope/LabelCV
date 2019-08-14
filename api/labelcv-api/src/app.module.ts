import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageModule } from './images/image.module';
import { AzureStorageModule } from '@nestjs/azure-storage';

@Module({
  imports: [ 
    ImageModule, 
    AzureStorageModule.withConfig({sasKey: process.env['AZURE_STORAGE_SAS_KEY'], 
    accountName: process.env['AZURE_STORAGE_ACCOUNT'], 
    containerName: process.env['AZURE_STORAGE_CONTAINER_NAME'] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
