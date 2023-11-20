import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, retry, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CarsService {
  basePath: string = 'https://credit-car.zeabur.app/api/v1';
  constructor(private http: HttpClient) { }
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Default error handling
      console.log(`An error occurred: ${error.error.message} `);
    } else {
      // Unsuccessful Response Error Code returned from Backend
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    // Return Observable with Error Message to Client
    return throwError(
      () => new Error('Something happened with request, please try again later')
    );
  }

  getAllCars(){
    return this.http.get(`${this.basePath}/cars`)
      .pipe(retry(2), catchError(this.handleError));
  }
}
