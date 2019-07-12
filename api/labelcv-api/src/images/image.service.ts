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

  async insert(imageData: ImageModel) {
    const { author, datasetId, originalHash } = imageData;

    const image: Image = {
      author,
      originalHash,
      datasetId,
      reviewCount: 0,
      status: ImageStatus.Processing,
      creationTimestamp: 'dateTime',
    };

    this.imageRepository.insert(image);
  }
}
