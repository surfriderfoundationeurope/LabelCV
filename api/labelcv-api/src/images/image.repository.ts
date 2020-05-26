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

const imageTable = process.env.PG_LABEL_SCHEMA + '.' + process.env.PG_IMG_TABLE;
const bboxTable = process.env.PG_LABEL_SCHEMA + '.' + process.env.PG_BOUNDINGBOX_TABLE;

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
  private readonly client : Client;

  constructor() {
    this.client = new Client(config);
    this.client.connect(err => {
      if (err) throw err;
      else {
        console.log("Client Postgres connected !");
      }
    });
  }

  async getOneImageRandom(): Promise<ImageLabel> {
    const query = 'SELECT * FROM '+ imageTable +' ORDER BY random() LIMIT 1';
    const res = await this.client.query(query);
    let resImg = res.rows.map(d => this.convertImgLabel(d));
    resImg[0].url = await this.getOneImage(resImg[0].filename);
    resImg[0].bbox = await this.getBBoxForOneImage(resImg[0].imageId);
    return resImg[0];
  }

  async getTrashTypes(): Promise<TrashType[]> {
    const query = 'SELECT * FROM '+ process.env.PG_TRASH_TABLE;
    const res = await this.client.query(query);

    return res.rows.map(d => this.convertTrash(d));
  }

  async getOneTrashType(idTrash: string): Promise<TrashType[]> {
    const query = 'SELECT * FROM '+ process.env.PG_TRASH_TABLE + ' WHERE id = ' + idTrash;
    const res = await this.client.query(query) ;

    return res.rows.map(d => this.convertTrash(d));
  }

  async updateImageData(imgData: ImageLabel) {
    const query = "UPDATE " + imageTable + " SET view = '" + imgData.view
     + "', image_quality = '" + imgData.imgQuality
     + "', context = '" + imgData.context + "' WHERE id = '" + imgData.imageId + "'";
    await this.client.query(query, (err, res) => {
       if (err) {
        console.error(err);
       }
       if (res) {
        console.log(res);
       }
     });
  }

  async addABBoxForAnImage(aBbox : ImageAnnotationBoundingBox) {
    const query = "INSERT INTO "+ bboxTable + " VALUES ( '" + uuidv4() +"', '"
     + aBbox.creatorId + "', current_timestamp, '" 
     + aBbox.idTrash + "', '" + aBbox.idImg + "', "
     + aBbox.location_x + ", " + aBbox.location_y + ", "
     + aBbox.width + ", " + aBbox.height + ")";
    await this.client.query(query, (err, res) => {
      if (err) {
       console.error(err);
      }
      if (res) {
       console.log(res);
      }
    });
  }

  async getBBoxForOneImage(idImg: uuidv4): Promise<ImageAnnotationBoundingBox[]> {
    const query = 'SELECT * FROM '+ bboxTable + ' WHERE ' + bboxTable + ".id_ref_images_for_labelling::text = '" + idImg + "'";
    const res = await this.client.query(query);

    return res.rows.map(d => this.convertBounding(d));
  }

  /*async bourinatorUpdate(){
    const containerClient = blobServiceClient.getContainerClient(containerName);
    
    for await (const blob of containerClient.listBlobsFlat()) {
      const query = "INSERT INTO "+ imageTable + " VALUES ( '" + uuidv4() +"', '954dfaf0-cf84-4e5d-ad9d-0d0d6badb884', current_timestamp, '" 
        + blob.name + "','','','','','')";
      const res = await this.client.query(query);
    }
  }*/

  async getOneImage(imgName: string): Promise<string> {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(imgName);
    
    return blobClient.url.concat('?'+sas);
  }

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
      name: d.name
    };
  }

  convertBounding(d: any): ImageAnnotationBoundingBox {
    return {
      id: d.id,
      creatorId: d.id_creator_fk,
      createdOn: d.createdon,
      idTrash: d.id_ref_trash_type_fk,
      idImg: d.id_ref_images_for_labelling,
      location_x: d.location_x,
      location_y: d.location_y,
      width: d.width,
      height: d.height
    };
  }
  
}

