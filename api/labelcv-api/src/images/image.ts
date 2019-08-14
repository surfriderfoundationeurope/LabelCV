import { ImageStatus } from './image.status';
import { ImageAnnotationBoundingBox } from './image.annotation.boundingbox';
import { ImageAnnotationType } from './image.annotation.type';

export interface ImageBase {
  imageId: string;
  _type: string;
  datasetId: string;
  createdAt: string;
  author: string;
}

export interface Image extends ImageBase {
  status: ImageStatus;
  parentItem: string;
}

export interface ImageAnnotation extends ImageBase {
  annotationId: string;
  annotationType: ImageAnnotationType;
  annotationOrigin: string;
  label: string;
  boundingBox: ImageAnnotationBoundingBox;
  
}