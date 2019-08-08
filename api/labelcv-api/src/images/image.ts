import { ImageStatus } from './image.status';

export interface Image {
  imageId: string;
  _type: string;
  datasetId: string;
  createdAt: string;
  status: ImageStatus;
  author: string;
  parentItem: string;
}
