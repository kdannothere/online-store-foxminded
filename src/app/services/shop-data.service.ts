import { Injectable } from '@angular/core';
import { catchError, timeout, Observable, of } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';
import * as AWS from 'aws-sdk';
import { Result } from '../models/result';
import { ShopError } from '../models/shop-error';
import { shopMessages } from '../shop-messages';

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

  getDatabase(): AWS.DynamoDB.DocumentClient {
    return this.dynamoDB;
  }

  getAllProducts(): Observable<Product[]> {
    const params = {
      TableName: 'products',
      Limit: 100,
    };
    let loading = false;

    return new Observable<Product[]>((observer) => {
      if (loading) return; // prevent multiple requests
      loading = true;

      const scanExecute = async (
        startKey?: AWS.DynamoDB.DocumentClient.Key
      ) => {
        try {
          const scanResponse = await this.dynamoDB
            .scan({ ...params, ExclusiveStartKey: startKey })
            .promise();
          const scanResults: Product[] = [];

          if (scanResponse.Items?.length) {
            scanResponse.Items.forEach((item) => {
              const formData = item['formData'] || null;
              if (formData) {
                const product = this.getProduct(formData);
                scanResults.push(product);
              }
            });
          }

          if (scanResponse.LastEvaluatedKey) {
            // Continue scanning if there are more items
            await scanExecute(scanResponse.LastEvaluatedKey);
          } else {
            observer.next(scanResults);
            observer.complete();
          }
        } catch (err: any) {
          console.error('Error scanning DynamoDB:', err.message);
          observer.error(err);
        }
      };

      scanExecute();
    });
  }

  getProductFormDataById(id: string): Observable<any> {
    const params = {
      TableName: 'products',
      KeyConditionExpression: 'id = :partitionKey',
      ExpressionAttributeValues: {
        ':partitionKey': id,
      },
    };

    return new Observable<any>((observer) => {
      this.dynamoDB
        .query(params)
        .promise()
        .then((data) => {
          if (data.Items?.length) {
            const formData = data.Items?.[0]?.['formData'] || null;
            if (formData) {
              observer.next(formData);
              observer.complete();
            }
            return;
          }
          observer.next(null);
          observer.complete();
        })
        .catch((err) => {
          console.error('Error querying DynamoDB:', err.message);
          observer.next(null);
          observer.complete();
        });
    });
  }

  deleteProductFormData(
    id: string,
    shop: string,
    timeLimit: number
  ): Observable<Result> {
    const params = {
      TableName: 'products',
      Key: {
        id: id,
        shop: shop,
      },
    };
    const result: Result = {
      data: null,
      error: null,
    };
    const error: ShopError = {
      msgDev: shopMessages.errorDeletingProduct + ' ',
      msgUser: shopMessages.errorDeletingProduct,
    };

    return new Observable<Result>((observer) => {
      this.dynamoDB.delete(params, (err) => {
        if (err) {
          error.msgDev = error.msgDev + err.message;
          result.error = error;
          observer.next(result); // Operation failed
        } else {
          result.data = true;
          observer.next(result); // Operation succeeded
        }
        observer.complete();
      });
    }).pipe(
      timeout(timeLimit),
      catchError((err) => {
        error.msgDev = error.msgDev + err.toString();
        if (err.name === 'TimeoutError') {
          error.msgUser = shopMessages.timeout;
        }
        result.error = error;
        return of(result);
      })
    );
  }

  saveData(
    id: string,
    shop: string,
    formData: string,
    timeLimit: number
  ): Observable<Result> {
    const params = {
      TableName: 'products',
      Item: {
        id: id,
        shop: shop,
        formData: formData,
      },
    };
    const result: Result = {
      data: null,
      error: null,
    };
    const error: ShopError = {
      msgDev: shopMessages.errorSavingProduct + ' ',
      msgUser: shopMessages.errorSavingProduct,
    };

    return new Observable<Result>((observer) => {
      this.dynamoDB.put(params, (err) => {
        if (err) {
          error.msgDev = error.msgDev + err.message;
          result.error = error;
          observer.next(result); // Operation failed
        } else {
          result.data = true;
          observer.next(result); // Operation succeeded
        }
        observer.complete();
      });
    }).pipe(
      timeout(timeLimit),
      catchError((err) => {
        error.msgDev = error.msgDev + err.toString();
        if (err.name === 'TimeoutError') {
          error.msgUser = shopMessages.timeout;
        }
        result.error = error;
        return of(result);
      })
    );
  }

  getProduct(formData: string): Product {
    const data = JSON.parse(formData);
    const product: Product = {
      id: data.id,
      imgUrl: data.imgUrl,
      price: data.price,
      discount: data.discount,
      main: data.main,
      shop: data.shop,
      name: data.name,
      description: data.description,
      shipping: data.shipping,
      discountUntil: data.discountUntil,
      isNew: data.isNew,
      color: data.color,
      size: data.size,
      review: data.review || [],
    };
    return product;
  }
}
