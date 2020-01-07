import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageRepository } from './image.repository';
import { ImageService } from './image.service';
import { AzureStorageModule } from '@nestjs/azure-storage';

@Module({
  imports: [
    AzureStorageModule.withConfig({
      accountName: process.env.AZURE_STORAGE_ACCOUNT,
      containerName: process.env.AZURE_STORAGE_CONTAINER_NAME,
      sasKey: process.env.AZURE_STORAGE_SAS_KEY,
    })
  ],
  controllers: [ImageController],
  providers: [ImageRepository, ImageService],
})
export class ImageModule {}
