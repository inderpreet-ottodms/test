import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { retry } from 'rxjs/operators';


import { environment } from '../../../environments/environment';

@Injectable()
export class DataService {
  private retryLimit = 1;
  private actionUrl: string;
  constructor(private _httpClient: HttpClient) {
    this.actionUrl = environment.APIEndPoint;
  }

  public getAll<T>(moduleUrl: string, data?: any): Observable<T> {
    if (data === undefined) {
      data = '';
    }
    return this._httpClient.get<T>(this.actionUrl + moduleUrl + data).pipe(
      retry(this.retryLimit)
    );
  }

  public getSingle<T>(moduleUrl: string, id: any): Observable<T> {
    return this._httpClient.get<T>(this.actionUrl + moduleUrl + id).pipe(
      retry(this.retryLimit)
    );
  }

  public addWithoutModel<T>(moduleUrl: string, newItem: any): Observable<T> {
    return this._httpClient.post<T>(this.actionUrl + moduleUrl, newItem).pipe(
      retry(this.retryLimit)
    );
  }

  public add<T>(moduleUrl: string, newItem: any): Observable<T> {
    return this._httpClient.post<T>(this.actionUrl + moduleUrl, newItem).pipe(
      retry(this.retryLimit)
    );
  }
  public addWithHeaders<T>(moduleUrl: string, newItem: any, headersValue: any): Observable<T> {
    return this._httpClient.post<T>(this.actionUrl + moduleUrl, newItem, { headers: headersValue }).pipe(
      retry(this.retryLimit)
    );
  }

  public addWithParameter<T>(moduleUrl: string, newItem: any): Observable<T> {
    return this._httpClient.post<T>(this.actionUrl + moduleUrl, '').pipe(
      retry(this.retryLimit)
    );
  }

  public UpdateWithoutId<T>(moduleUrl: string, newItem: any): Observable<T> {
    return this._httpClient.put<T>(this.actionUrl + moduleUrl, newItem).pipe(
      retry(this.retryLimit)
    );
  }

  public update<T>(
    moduleUrl: string,
    id: number,
    itemToUpdate: any
  ): Observable<T> {
    return this._httpClient
      .put<T>(this.actionUrl + moduleUrl + id, itemToUpdate)
      .pipe(
        retry(this.retryLimit)
      );
  }
  public updatePass<T>(moduleUrl: string, itemToUpdate: any): Observable<T> {
    return this._httpClient
      .put<T>(this.actionUrl + moduleUrl, itemToUpdate)
      .pipe(
        retry(this.retryLimit)
      );
  }

  public delete<T>(moduleUrl: string, id: number): Observable<T> {
    return this._httpClient.delete<T>(this.actionUrl + moduleUrl + id).pipe(
      retry(this.retryLimit)
    );
  }

  public deleteCusomer<T>(moduleUrl: string): Observable<T> {
    return this._httpClient.delete<T>(this.actionUrl + moduleUrl).pipe(
      retry(this.retryLimit)
    );
  }

  public deletePost<T>(moduleUrl: string, newItem: any): Observable<T> {
    return this._httpClient.post<T>(this.actionUrl + moduleUrl, newItem).pipe(
      retry(this.retryLimit)
    );
  }
  public uploadFile(url: string, formData: any): Observable<any> {
    return new Observable(observable => {
      fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': 'bearer ' + localStorage.getItem('Token')
        },
      })
        .then(response => response.json())
        .then(response => {
          observable.next({ _body: JSON.stringify(response) });
        })
        .catch(err => {
          observable.next({
            _body: JSON.stringify({
              "result": false,
              err:err,
              errorMessage: "File could not uploaded"
            })
          });
        });
    })
  }
}



@Injectable()
export class DataStatusService {
  private retryLimit = 1;
  private actionUrl: string;

  constructor(private _httpClient: HttpClient) {
    this.actionUrl = environment.APIEndPoint;
  }
  public UpdateWithoutId<T>(moduleUrl: string, newItem: any): Observable<T | HttpResponse<T>> {
    return this._httpClient.put<T>(this.actionUrl + moduleUrl, newItem, { observe: 'response' }).pipe(
      retry(this.retryLimit)
    );
  }
  public getAll<T>(moduleUrl: string, data?: any): Observable<T | HttpResponse<T>> {
    if (data === undefined) {
      data = '';
    }
    return this._httpClient.get<T>(this.actionUrl + moduleUrl + data, { observe: 'response' }).pipe(
      retry(this.retryLimit),
    );
  }

  public getSingle<T>(moduleUrl: string, id: any): Observable<T | HttpResponse<T>> {
    return this._httpClient.get<T>(this.actionUrl + moduleUrl + id, { observe: 'response' }).pipe(
      retry(this.retryLimit),
    );
  }

  public add<T>(moduleUrl: string, newItem: any): Observable<T | HttpResponse<T>> {
    return this._httpClient.post<T>(this.actionUrl + moduleUrl, newItem, { observe: 'response' }).pipe(
      retry(this.retryLimit),
    );
  }
}
