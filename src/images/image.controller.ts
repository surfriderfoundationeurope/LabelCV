import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageLabel } from './image';
import {ImageAnnotationBoundingBox} from './image.annotation.boundingbox';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('/imgName')
  async getOneImage(@Param() params) {
    return await this.imageService.getOneImageFromStorage(params.imgName);
  }

  @Get('/random')
  async getOneImageRandom() {
    return await this.imageService.getOneImageRandom();
  }

  @Get('/trashtypes')
  async getImageTrashTypes() {
    return await this.imageService.getImageTrashTypes();
  }

  @Get('/bbox/:imageId')
  async getImageBBox(@Param() params) {
    return await this.imageService.getImageBBox(params.imageId);
  }

  @Get('/status')
  async getStatus() {
    return this.imageService.getStatus();
  }

  @Post('/annotate')
  async annotateImage(@Body()annotation: ImageAnnotationBoundingBox) {
    return await this.imageService.annotateImage(annotation);
  }

  @Post('/update')
  async updateImageData(@Body()imgData: ImageLabel) {
    return await this.imageService.updateImageData(imgData);
  }

  /*@Get('/bourinator')
  async massiveInsert() {
    return await this.imageService.bourinator();
  }*/
}

