import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { ImageLabel } from './image';
import { BlobServiceClient,
  StorageSharedKeyCredential,
  SASProtocol,
  BlobSASPermissions,
  generateBlobSASQueryParameters } from '@azure/storage-blob';
import {ImageAnnotationBoundingBox} from './image.annotation.boundingbox';
import { TrashType } from './trashtype.model';


import { CosmosClient, SqlQuerySpec, FeedOptions, ConnectionPolicy } from '@azure/cosmos';
import { Image, ImageAnnotation } from './image';
import { ImageStatus } from './image.status';
import { ImageAnnotationModel } from './image.annotation.model';

const DATABASE_NAME = 'LabelCV';
const IMAGE_CONTAINER_NAME = 'images';

const containerName = 'testforlabelbackend';
const sharedKeyCredential = new StorageSharedKeyCredential(process.env.AZURE_ACCOUNT_NAME, process.env.AZURE_ACC_KEY);
const blobServiceClient = new BlobServiceClient(
  'https://'+process.env.AZURE_ACCOUNT_NAME+'.blob.core.windows.net',
  sharedKeyCredential
);
const now = new Date();
  now.setMinutes(now.getMinutes() - 5);

const tmr = new Date();
  tmr.setMinutes(tmr.getMinutes() + 45);

const sas = generateBlobSASQueryParameters(
  {
    containerName,
    startsOn: now,
    expiresOn: tmr,
    permissions: BlobSASPermissions.parse("r"),
    protocol: SASProtocol.HttpsAndHttp,
  },
  sharedKeyCredential
).toString();

const imageTable = process.env.POSTGRES_LABEL_SCHEMA + '.' + process.env.POSTGRES_IMG_TABLE;
const bboxTable = process.env.POSTGRES_LABEL_SCHEMA + '.' + process.env.POSTGRES_BOUNDINGBOX_TABLE;
const trashTable = 'campaign.trash_type';

const config = {
  host: process.env.PG_HOST,
  user: process.env.PG_USERNAME,
  password: process.env.PG_PWD,
  database: process.env.PG_DATABASE,
  port: 5432,
  ssl: true
};

@Injectable()
export class ImageRepository {
  //private readonly cosmosClient: CosmosClient;
  private readonly client : Client;

  constructor() {
    this.client = new Client(config);
    this.client.connect(err => {
      if (err) throw err;
      else {
        console.log("Client Postgres connected !");
      }
    });
    /*this.cosmosClient = new CosmosClient({
      endpoint: process.env.COSMOSDB_ENDPOINT,
      auth: { masterKey: process.env.COSMOSDB_KEY },
      connectionPolicy: { DisableSSLVerification: (!!process.env.COSMOSDB_EMULATOR_USED) || false},
    });*/
  }

  /*async insert(image: Image) {
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
  }*/

  async getOneImageRandom(): Promise<ImageLabel> {
    const query = 'SELECT * FROM '+ imageTable +' ORDER BY random() LIMIT 1';
    const res = await this.client.query(query);
    let resImg = res.rows.map(d => this.convertImgLabel(d));
    resImg[0].url = await this.getOneImage(resImg[0].filename);
    resImg[0].bbox = await this.getBBoxForOneImage(resImg[0].imageId);
    return resImg[0];
  }

  async getTrashTypes(): Promise<TrashType[]> {
    const query = 'SELECT * FROM '+ trashTable;
    const res = await this.client.query(query);

    return res.rows.map(d => this.convertTrash(d));
  }

  async getOneTrashType(idTrash: string): Promise<TrashType[]> {
    const query = 'SELECT * FROM '+ trashTable + ' WHERE id = ' + idTrash;
    const res = await this.client.query(query) ;

    return res.rows.map(d => this.convertTrash(d));
  }

  async getBBoxForOneImage(idImg: uuidv4): Promise<ImageAnnotationBoundingBox[]> {
    const query = 'SELECT * FROM '+ bboxTable + ' WHERE ' + bboxTable + ".id_ref_images_for_labelling::text = '" + idImg + "'";
    const res = await this.client.query(query) ;

    return res.rows.map(d => this.convertBounding(d));
  }

  async getOneImage(imgName: string): Promise<string> {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    //for await (const blob of containerClient.listBlobsFlat()) {
      //if (img == blob.name) {
        const blobClient = containerClient.getBlobClient(imgName);
        return blobClient.url.concat('?'+sas);
      //}
    //}
  }

  /*async getNextImageToAnnotate(dataset: string): Promise<Image> {
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
  }*/

  convertImgLabel(d: any): ImageLabel {
    return {
      imageId: d.id,
      creatorId: d.id_creator_fk,
      createdOn: d.createdon,
      filename: d.filename,
      view: d.view,
      imgQuality: d.image_quality,
      context: d.context,
      url:'',
      bbox:[]
    };
  }

  convertTrash(d: any): TrashType {
    return {
      id: d.id,
      type: d.type
    };
  }

  convertBounding(d: any): ImageAnnotationBoundingBox {
    return {
      id: d.id,
      idTrash: d.id_ref_trash_type_fk,
      idImg: d.id_ref_images_for_labelling,
      location_x: d.location_x,
      location_y: d.location_y,
      width: d.width,
      height: d.height
    };
  }
  
}

