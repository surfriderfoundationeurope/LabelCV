import { IsNotEmpty } from 'class-validator';
export class ImageModel {
  @IsNotEmpty()
  originalHash: string;
  @IsNotEmpty()
  datasetId: string;
  @IsNotEmpty()
  author: string;
}
