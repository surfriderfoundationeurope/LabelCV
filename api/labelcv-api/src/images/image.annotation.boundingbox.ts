
export interface ImageAnnotationBoundingBox {
  id: string;
  creatorId: string,
  createdOn: string;
  trashId: string;
  imageId: string;
  location_x: number;
  location_y: number;
  width: number;
  height: number;
}
