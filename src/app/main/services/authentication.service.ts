import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})


export class AuthenticationService {
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

  //Sign-Up
  signUp(user : any): Observable<any>{
    return this.http.post(`${this.basePath}/users`, user)
      .pipe(retry(2), catchError(this.handleError));
  }
  //Sign-In
  signIn(email: string){
    return this.http.get(`${this.basePath}/users?email=${email}`)
      .pipe(retry(2), catchError(error =>{
        this.handleError(error);
        return throwError(error);
      }));
  }
}
