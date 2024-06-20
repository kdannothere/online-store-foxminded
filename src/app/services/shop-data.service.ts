import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import * as AWS from 'aws-sdk';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopDataService {
  private dynamoDB: AWS.DynamoDB.DocumentClient;

  // Access credentials
  accessKeyId = environment.awsAccessKeyId;
  secretAccessKey = environment.awsSecretAccessKey;

  constructor() {
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
    this.dynamoDB = new AWS.DynamoDB.DocumentClient();
  }

  getAllProducts(): Observable<Product[]> {
    const params = {
      TableName: 'products', // Replace with your actual table name
    };

    return new Observable<Product[]>((observer) => {
      const scanResults: Product[] = [];

      const scanExecute = async (
        startKey?: AWS.DynamoDB.DocumentClient.Key
      ) => {
        try {
          const scanResponse = await this.dynamoDB
            .scan({ ...params, ExclusiveStartKey: startKey })
            .promise();
          if (scanResponse.Items?.length) {
            const allProducts: Product[] = [];
            scanResponse.Items.forEach((item) => {
              const product = JSON.parse(
                (item as any).product.toString()
              ) as Product;
              allProducts.push(product);
            });
            scanResults.push(...allProducts);
          }

          if (scanResponse.LastEvaluatedKey) {
            // Continue scanning if there are more items
            await scanExecute(scanResponse.LastEvaluatedKey);
          } else {
            observer.next(scanResults);
            observer.complete();
          }
        } catch (err: any) {
          console.error('Error scanning DynamoDB:', err);
          observer.error(err);
        }
      };

      scanExecute();
    });
  }

  getUniqueId(): number {
    return new Date().getTime();
  }

  getItemById(id: number): Observable<Product | null> {
    const params = {
      TableName: 'products',
      KeyConditionExpression: 'id = :partitionKey',
      ExpressionAttributeValues: {
        ':partitionKey': id.toString(),
      },
    };

    return new Observable<Product | null>((observer) => {
      this.dynamoDB
        .query(params)
        .promise()
        .then((data) => {
          if (data.Items?.length) {
            const product = JSON.parse(
              (data.Items[0] as any).product.toString()
            ) as Product;
            observer.next(product);
          } else {
            observer.next(null);
          }
          observer.complete();
        })
        .catch((err) => {
          console.error('Error querying DynamoDB:', err.message);
          observer.next(null);
          observer.complete();
        });
    });
  }

  async saveData(product: Product, formData: string) {
    const params = {
      TableName: 'products',
      Item: {
        id: product.id.toString(),
        shop: product.shop,
        product: JSON.stringify(product),
        formData: formData,
      },
    };

    try {
      await this.dynamoDB.put(params).promise();
      return true; // Operation succeeded
    } catch (err: any) {
      console.error('Error saving product:', err.toString());
      return false; // Operation failed
    }
  }

  // updateProduct(product: Product) {}

  // deleteProduct(product: Product) {}
}
