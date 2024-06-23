import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment';
import * as AWS from 'aws-sdk';

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
			TableName: 'products',
			Limit: 100,
		};
		let loading = false;
	
		return new Observable<Product[]>((observer) => {
			if (loading) return; // prevent multiple requests
			loading = true;
	
			const scanExecute = async (startKey?: AWS.DynamoDB.DocumentClient.Key) => {
				try {
					const scanResponse = await this.dynamoDB.scan({ ...params, ExclusiveStartKey: startKey }).promise();
					const scanResults: Product[] = [];
	
					if (scanResponse.Items?.length) {
						scanResponse.Items.forEach((item) => {
							const formData = item['formData'];
							const product = this.getProduct(formData);
							scanResults.push(product);
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
	

  getUniqueId(): number {
    return new Date().getTime();
  }

  getProductById(id: number): Observable<Product | null> {
		const params = {
			TableName: 'products',
			KeyConditionExpression: 'id = :partitionKey',
			ExpressionAttributeValues: {
				':partitionKey': id.toString(),
			},
		};
	
		return new Observable<Product | null>((observer) => {
			this.dynamoDB.query(params).promise()
				.then((data) => {
					const formData = data.Items?.[0]?.['formData'] || null;
					observer.next(this.getProduct(formData));
					observer.complete();
				})
				.catch((err) => {
					console.error('Error querying DynamoDB:', err.message);
					observer.next(null);
					observer.complete();
				});
		});
	}
	

  async saveData(id: string, shop: string, formData: string) {
    const params = {
      TableName: 'products',
      Item: {
        id: id,
        shop: shop,
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

  // updateProduct(product: Product) {}

  // deleteProduct(product: Product) {}
}
