import { Controller, Post, Get, Body, Param, UseInterceptors, Logger, UploadedFile } from '@nestjs/common';
import { ImageModel } from './Image.post.model';
import { ImageService } from './image.service';
import { ImageAnnotationModel } from './image.annotation.model';
import { AzureStorageFileInterceptor, UploadedFileMetadata } from '@nestjs/azure-storage';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  async getProcessingImages() {
    return await this.imageService.getAllProcessingImages();
  }

  @Get('next')
  async getNextImageToAnnotate() {
    return await this.imageService.getNextImageToAnnotate('devdataset1');
  }

  @Post()
  async postImage(@Body() imageData: ImageModel) {
    await this.imageService.insert(imageData);
  }

  @Post(':imageId/annotate')
  async annotateImage(@Param() params, @Body()annotation: ImageAnnotationModel) {
    return await this.imageService.annotateImage(params.imageId, annotation);
  }

  @Post('upload')
  @UseInterceptors(AzureStorageFileInterceptor('file'))
  async uploadImage( @UploadedFile() file: UploadedFileMetadata) {
    Logger.log(`Storage Account: ${process.env['AZURE_STORAGE_ACCOUNT']} / ${process.env.AZURE_STORAGE_ACCOUNT} `, 'ImageController');
    Logger.log(`Storage URL: ${file.storageUrl}`, 'ImageController');
  }
}
