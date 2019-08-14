import { IsNotEmpty } from 'class-validator';
import { ImageAnnotationBoundingBox } from './image.annotation.boundingbox';
import { ImageAnnotationType } from './image.annotation.type';

export class ImageAnnotationModel {
  @IsNotEmpty()
  imageId: string;
  @IsNotEmpty()
  datasetId: string;
  @IsNotEmpty()
  annotationId: string;
  @IsNotEmpty()
  author: string;
  timestamp: string;
  // Amount of time it took to annotate the data.
  // If done by human: measure time spent in the UI
  // If done by an AI: inference time
  duration: number;
  annotationType: ImageAnnotationType;
  annotationOrigin: string;
  label: string;
  boundingBox: ImageAnnotationBoundingBox;
}
