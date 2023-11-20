import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, retry, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  basePath: string = 'http://localhost:3000/api/v1';
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


  postLoan(loan : any): Observable<any>{
    return this.http.post(`${this.basePath}/loans`, loan)
      .pipe(retry(2), catchError(this.handleError));
  }
  getLoansByUserId(userId : any): Observable<any>{
    return this.http.get(`${this.basePath}/loans?userId=${userId}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  putLoanById(id: any, loan: any){
    return this.http.put(`${this.basePath}/loans/${id}`, loan)
  }

}
