import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  entryUser = new BehaviorSubject<any>("");
  entryLoanDetails = new BehaviorSubject<any>("");
  entryActualPrice = new BehaviorSubject<any>("");

  setUser(user: any){
    this.entryUser.next(user);
  }

  getUser(){
    return this.entryUser.asObservable();
  }

  setLoanDetails(loanDetails: any){
    this.entryLoanDetails.next(loanDetails);
  }

  getLoanDetails(){
    return this.entryLoanDetails.asObservable();
  }

  setActualPrice(actualPrice: any){
    this.entryActualPrice.next(actualPrice);
  }

  getActualPrice(){
    return this.entryActualPrice.asObservable();
  }
}
