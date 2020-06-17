import { Injectable } from '@nestjs/common';
import { ImageRepository } from './image.repository';
import { ImageAnnotationBoundingBox } from './image.annotation.boundingbox';
import { ImageLabel } from './image';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImageService {

  constructor(private readonly imageRepository: ImageRepository) {}

  async getOneImageFromStorage(imgName: string) {
    return await this.imageRepository.getOneImage(imgName);
  }

  async getOneImageRandom() {
    return await this.imageRepository.getOneImageRandom();
  }
  
  async getStatus() {
    return this.imageRepository.getStatus();
  }
  
  async getImageBBox(imgId: uuidv4) {
    return await this.imageRepository.getBBoxForOneImage(imgId);
  }
  
  async getImageTrashTypes() {
    return await this.imageRepository.getTrashTypes();
  }

  async annotateImage(imageAnnotation: ImageAnnotationBoundingBox) {
    await this.imageRepository.addABBoxForAnImage(imageAnnotation);
  }

  async updateImageData(imgData: ImageLabel) {
    await this.imageRepository.updateImageData(imgData);
  }

  /*async bourinator() {
    await this.imageRepository.bourinatorUpdate();
  }*/
}
