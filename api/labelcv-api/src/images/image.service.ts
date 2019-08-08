import { Injectable } from '@nestjs/common';
import { ImageRepository } from './image.repository';
import { ImageStatus } from './image.status';
import { ImageModel } from './Image.post.model';
import { Image } from './image';

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
}
