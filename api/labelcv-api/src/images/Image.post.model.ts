import { IsNotEmpty } from 'class-validator';
export class ImageModel {
  @IsNotEmpty()
  imageId: string;
  @IsNotEmpty()
  datasetId: string;
  @IsNotEmpty()
  author: string;
}
