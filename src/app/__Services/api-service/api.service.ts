import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { of,Observable } from 'rxjs';
// import { of } from 'rxjs/observable/of';
import { environment } from '../../../environments/environment';

const endpoint = environment.APIEndPoint; //'https://uatapi.mfg.com/api/';


@Injectable()
export class ApiService {
  accessToken = localStorage.getItem('Token');
  paymentToken = localStorage.getItem('paymentToken');
  httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*', //'GET,POST,PATCH,DELETE,PUT,OPTIONS',
      'Access-Control-Allow-Headers': '*', //Origin, Content-Type, X-Auth-Token, content-type',
      'Allow-Origin-With-Credentials': '*',
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.accessToken
    })
    // 'paymentToken': this.paymentToken
  };

  constructor(private http: HttpClient) { }
  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
  resetServiceStatus(): any {
    // _isInProcess.ServiceInProcess = false;
    // this.globalDeclarations.ResponseMessage = '';
  }

  get(_name: string,
    _qPara?: HttpParams): Observable<any> {
    return this.http.get(endpoint + _name, { headers: this.httpOptions.headers, params: _qPara })
      .pipe(
        map(this.extractData),
        //tap((x) => (this.resetServiceStatus(_isInProcess))),
        catchError(this.handleError<any>(null))
      )
      .pipe
      (
        tap((x) => (this.resetServiceStatus()))
      )
  }
  post(_name: string,
    _qPara?: any): Observable<any> {
    return this.http.post<any>(endpoint + _name, JSON.stringify(_qPara), this.httpOptions)
      .pipe
      (
        tap((x) => (this.resetServiceStatus())),
        catchError(this.handleError<any>(null))
      );
  }
  put(_name: string,
    _qPara?: any): Observable<any> {
    return this.http.put<any>(endpoint + _name, JSON.stringify(_qPara), this.httpOptions)
      .pipe
      (
        tap((x) => (this.resetServiceStatus())),
        catchError(this.handleError<any>(null))
      );
  }
  delete(_name: string,
    _qPara?: HttpParams): Observable<any> {
    return this.http.delete(endpoint + _name, { headers: this.httpOptions.headers, params: _qPara })
      .pipe(
        map(this.extractData),
        //tap((x) => (this.resetServiceStatus(_isInProcess))),
        catchError(this.handleError<any>(null))
      )
      .pipe
      (
        tap((x) => (this.resetServiceStatus()))
      )
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // this.globalDeclarations.ResponseMessage = '';
      // // TODO: send the error to remote logging infrastructure
      // console.error(error); // log to console instead

      // // TODO: better job of transforming error for user consumption
      // console.log('${operation} failed: ${error.message}');

      // // Let the app keep running by returning an empty result.
      if (error instanceof HttpErrorResponse) {
        //alert(error.message);
        // console.log(error);
        // global.ServiceInProcess = false;
        // this.globalDeclarations.ResponseMessage = error.error.message != null ?
        //   error.error.message :
        //   'Unable to process your request';


      }
      return of(result as T);
    };
  }
}
