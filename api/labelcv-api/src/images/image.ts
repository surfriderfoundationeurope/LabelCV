import { ImageAnnotationBoundingBox } from './image.annotation.boundingbox';

export interface ImageLabel {
  imageId: string;
  creatorId: string;
  createdOn: string;
  filename: string;
  view: string;
  imgQuality: string;
  context: string;
  url:string;
  bbox: ImageAnnotationBoundingBox[];
}