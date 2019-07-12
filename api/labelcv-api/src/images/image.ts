import { ImageStatus } from "./image.status";

export interface Image {
   originalHash: string;
   creationTimestamp: string;
   datasetId: string;
   author: string;
   reviewCount: number;
   status: ImageStatus;
}