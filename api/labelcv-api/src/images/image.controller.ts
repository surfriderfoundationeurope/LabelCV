import { Controller, Post, Get, Body } from '@nestjs/common';
import { ImageModel } from './Image.post.model';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  async getProcessingImages() {
    return await this.imageService.getAllProcessingImages();
  }

  @Post()
  async postImage(@Body() imageData: ImageModel) {
    await this.imageService.insert(imageData);
  }
}
