import { Controller, Post, Get, Body } from "@nestjs/common";
import { ImageRepository } from "./image.repository";
import { Image } from "./image";
import { ImageStatus } from "./image.status";
import { IsEmpty } from "class-validator";
import { ImagePostModel } from "./Image.post.model";

@Controller("images")
export class ImageController {
    constructor(private readonly imageRepository: ImageRepository) {

    }

    @Get()
    async getProcessingImages(){
        return await this.imageRepository.getAllProcessing();
    }

    @Post()
    async postImage(@Body()imageData: ImagePostModel) {
        const { author, datasetId, originalHash } = imageData;
        
        const image: Image = {
            author,
            originalHash,
            datasetId,
            reviewCount: 0,
            status: ImageStatus.Processing,
            creationTimestamp: "dateTime"
        }

        await this.imageRepository.insert(image);
    }
}

