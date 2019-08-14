import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ImageModel } from './Image.post.model';
import { ImageService } from './image.service';
import { ImageAnnotationModel } from './image.annotation.model';

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

}
