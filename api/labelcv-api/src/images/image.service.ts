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
  
  /*async getNextImageToAnnotate(dataset: string) {
    return await this.imageRepository.getNextImageToAnnotate(dataset);
  }

  async insert(imageData: ImageModel) {
    const { imageId, author, datasetId } = imageData;

    const image: Image = {
      imageId,
      _type: 'image',
      datasetId,
      author,
      status: ImageStatus.Processing,
      createdAt: new Date().toISOString(),
      parentItem: null,
    };

    this.imageRepository.insert(image);
  }

  async annotateImage(imageIdOrigin: any, imageAnnotation: ImageAnnotationModel) {
    const { imageId, author, datasetId, annotationId, annotationType, annotationOrigin, label, boundingBox } = imageAnnotation;

    const annotation: ImageAnnotation = {
      imageId,
      _type: 'annotation',
      datasetId,
      annotationId,
      createdAt: new Date().toISOString(),
      author,
      annotationType,
      annotationOrigin,
      label,
      boundingBox,
    };

    await this.imageRepository.insertAnnotation(annotation);
  }*/
}
