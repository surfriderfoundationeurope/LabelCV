import { Injectable } from '@nestjs/common';
import { CosmosClient, SqlQuerySpec, FeedOptions } from '@azure/cosmos';
import { Image } from './image';
import { ImageStatus } from './image.status';

@Injectable()
export class ImageRepository {
  private readonly cosmosClient: CosmosClient;

  constructor() {
    this.cosmosClient = new CosmosClient({
      endpoint: process.env.COSMOSDB_ENDPOINT,
      auth: { masterKey: process.env.COSMOSDB_KEY },
    });
  }

  async insert(image: Image) {
    const imageContainer = this.getImageCollection();
    await imageContainer.items.create(image);
  }

  private getImageCollection() {
    const db = this.cosmosClient.database('labelcv');
    const imageContainer = db.container('image');
    return imageContainer;
  }

  async getAllImagesByStatus(status: ImageStatus): Promise<Array<Image>> {
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

  convert(d: any): Image {
    return {
      author: d.author,
      creationTimestamp: d.creationTimestamp,
      status: d.status,
      reviewCount: d.reviewCount,
      originalHash: d.originalHash,
      datasetId: d.datasetId,
    };
  }
}
