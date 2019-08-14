import { Injectable } from '@nestjs/common';
import { CosmosClient, SqlQuerySpec, FeedOptions, ConnectionPolicy } from '@azure/cosmos';
import { Image, ImageAnnotation } from './image';
import { ImageStatus } from './image.status';
import { ImageAnnotationModel } from './image.annotation.model';

const DATABASE_NAME = 'LabelCV';
const IMAGE_CONTAINER_NAME = 'images';

@Injectable()
export class ImageRepository {
  private readonly cosmosClient: CosmosClient;

  constructor() {
    this.cosmosClient = new CosmosClient({
      endpoint: process.env.COSMOSDB_ENDPOINT,
      auth: { masterKey: process.env.COSMOSDB_KEY },
      connectionPolicy: { DisableSSLVerification: (!!process.env.COSMOSDB_EMULATOR_USED) || false},
    });
  }

  async insert(image: Image) {
    const imageContainer = this.getImageCollection();
    await imageContainer.items.create(image);
  }

  private getImageCollection() {
    const db = this.cosmosClient.database(DATABASE_NAME);
    const imageContainer = db.container(IMAGE_CONTAINER_NAME);
    return imageContainer;
  }

  async getAllImagesByStatus(status: ImageStatus): Promise<Image[]> {
    const imageContainer = this.getImageCollection();
    const query: SqlQuerySpec = {
      query: `SELECT *
              FROM root
              WHERE root.status = @status`,
      parameters: [{ name: '@status', value: status }],
    };

    const options: FeedOptions = { enableCrossPartitionQuery: true };
    const iterator = imageContainer.items.query(query, options);
    const docs = await iterator.toArray();
    return docs.result.map(d => this.convert(d));
  }

  async getNextImageToAnnotate(dataset: string): Promise<Image> {
    const imageContainer = this.getImageCollection();
    const query: SqlQuerySpec = {
      query: `SELECT *
              FROM root
              WHERE
              root.status = @status
              AND root._type = 'image'
              ORDER BY root._ts DESC
              OFFSET 0 LIMIT 1
              `,
      parameters: [{ name: '@status', value: ImageStatus.Rating }],
    };

    const options: FeedOptions = { enableCrossPartitionQuery: true };
    const iterator = imageContainer.items.query(query, options);
    const docs = await iterator.toArray();
    return this.convert(docs.result[0]);
  }

  async insertAnnotation(imageAnotation: ImageAnnotation) {
    const imageContainer = this.getImageCollection();
    await imageContainer.items.create(imageAnotation);
  }

  convert(d: any): Image {
    return {
      author: d.author,
      _type: d._type,
      createdAt: d.createdAt,
      status: d.status,
      imageId: d.imageId,
      datasetId: d.datasetId,
      parentItem: d.parentItem,
    };
  }
}

