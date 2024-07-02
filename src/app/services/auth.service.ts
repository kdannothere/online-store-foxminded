import { Injectable } from '@angular/core';
import { UserRole } from '../models/user-role';
import { ShopDataService } from './shop-data.service';
import { Observable } from 'rxjs';
import { Result } from '../models/result';
import { Error } from '../models/error';
import { CookieService } from './cookie.service';
import { UserCookie } from '../models/user-cookie';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private shopDataService: ShopDataService,
    private cookieService: CookieService,
    private userService: UserService
  ) {}

  private hasRole(roles: UserRole[]): boolean {
    return roles.some((role) => this.userService.roles.includes(role));
  }

  isAuthenticated(): boolean {
    return this.hasRole([UserRole.Admin, UserRole.Owner, UserRole.Customer]);
  }

  isAdmin(): boolean {
    return this.hasRole([UserRole.Admin]);
  }

  isOwner(): boolean {
    return this.hasRole([UserRole.Owner]);
  }

  isCustomer(): boolean {
    return this.hasRole([UserRole.Customer]);
  }

  saveBackRoute(backRoute: string) {
    this.cookieService.saveCookie('back-route', backRoute);
  }

  getBackRoute(): string {
    return this.cookieService.getCookie('back-route');
  }

  signIn(
    email: string,
    password: string,
    socialLogin: boolean
  ): Observable<Result> {
    const database = this.shopDataService.getDatabase();
    const params = {
      TableName: 'users',
      KeyConditionExpression: 'email = :partitionKey',
      ExpressionAttributeValues: {
        ':partitionKey': email,
      },
    };

    return new Observable<any>((observer) => {
      database
        .query(params)
        .promise()
        .then((data) => {
          if (data.Items?.length) {
            const user = data.Items?.[0];
            const userPassword = user?.['password'] || '';
            const isPasswordCorrect =
              userPassword !== undefined && userPassword === password;
            if (isPasswordCorrect || socialLogin) {
              const userData = user?.['data'] || '';
              const userRoles: string[] = user?.['roles'] || [];
              const oldUserCookie: any = this.getUserCookie();
              const userCookie: UserCookie = {
                email: email,
                roles: userRoles,
                googleToken: oldUserCookie.googleToken || '',
                facebookToken: oldUserCookie.facebookToken || '',
              };
              this.cookieService.saveCookie('user', JSON.stringify(userCookie));
              const result: Result = {
                data: userData,
                error: null,
              };
              observer.next(result);
              observer.complete();
            }
            return;
          }
          const error: Error = {
            msgDev: 'User not found in database',
            msgUser: 'Email or password is wrong.',
          };
          const result: Result = {
            data: null,
            error: error,
          };
          observer.next(result);
          observer.complete();
        })
        .catch((err) => {
          const error: Error = {
            msgDev: 'Error querying DynamoDB:' + err.message,
            msgUser: 'Something went wrong. Please try again.',
          };
          const result: Result = {
            data: null,
            error: error,
          };
          observer.next(result);
          observer.complete();
        });
    });
  }

  logOut() {
    this.clearUserCookie();
  }

  registerUser(
    email: string,
    password: string,
    data: string
  ): Observable<Result> {
    const database = this.shopDataService.getDatabase();
    const params = {
      TableName: 'users',
      Item: {
        email: email,
        password: password,
        data: data,
        roles: [UserRole.Customer],
      },
    };

    return new Observable<Result>((observer) => {
      this.emailExists(email).then((exists) => {
        if (exists) {
          const error: Error = {
            msgDev: 'Email already exists in database.',
            msgUser:
              'Email already exists. Please try another email or sign in.',
          };
          const result: Result = {
            data: null,
            error: error,
          };
          observer.next(result);
          observer.complete();
          return;
        }
        if (exists === null) {
          const error: Error = {
            msgDev: 'Error in emailExists()',
            msgUser: 'Something went wrong. Please try again.',
          };
          const result: Result = {
            data: null,
            error: error,
          };
          observer.next(result);
          observer.complete();
        }
      });
      database
        .put(params)
        .promise()
        .then((_data) => {
          const result: Result = {
            data: true,
            error: null,
          };
          observer.next(result);
          observer.complete();
        })
        .catch((err) => {
          const error: Error = {
            msgDev: 'Error saving user in DynamoDB:' + err.message,
            msgUser: 'Something went wrong. Please try again.',
          };
          const result: Result = {
            data: null,
            error: error,
          };
          observer.next(result);
          observer.complete();
        });
    });
  }

  async emailExists(email: string): Promise<boolean | null> {
    try {
      const params = {
        TableName: 'users',
        KeyConditionExpression: 'email = :partitionKey',
        ExpressionAttributeValues: {
          ':partitionKey': email,
        },
      };

      const database = this.shopDataService.getDatabase();
      const response = await database.query(params).promise();

      const items = response.Items || [];

      return items.length > 0;
    } catch (error: any) {
      console.error('Error checking email existence:', error.message);
      return null;
    }
  }

  getUserCookie(): any {
    const userCookie: string = this.cookieService.getCookie('user');
    if (userCookie) return JSON.parse(userCookie);
    return {};
  }

  clearUserCookie() {
    this.cookieService.saveCookie('user', '');
  }

  updateUserCookie(userCookie: UserCookie) {
    const data: string = JSON.stringify(userCookie);
    return this.cookieService.saveCookie('user', data);
  }
}
