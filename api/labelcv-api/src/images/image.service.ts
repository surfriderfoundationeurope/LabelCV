import { Injectable } from '@nestjs/common';
import { ImageRepository } from './image.repository';
import { ImageStatus } from './image.status';
import { ImageModel } from './Image.post.model';
import { Image } from './image';
import { ImageAnnotationModel } from './image.annotation.model';
import { ImageAnnotation } from './image';

@Injectable()
export class ImageService {

  constructor(private readonly imageRepository: ImageRepository) {}

  async getAllProcessingImages() {
    return await this.imageRepository.getAllImagesByStatus(
      ImageStatus.Processing,
    );
  }

  async getNextImageToAnnotate(dataset: string) {
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
  }
}
