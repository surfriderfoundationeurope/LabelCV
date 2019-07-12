import { IsNotEmpty } from "class-validator";
export class ImagePostModel {
    @IsNotEmpty()
    originalHash: string;
    @IsNotEmpty()
    datasetId: string;
    @IsNotEmpty()
    author: string;
}
