import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EntryService} from "../../services/entry.service";
import {LoanService} from "../../services/loan.service";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable'
import {Fee} from "../payment-plan/payment-plan.component";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit{
  user:any = {}
  client = ""
  loans: any = []
  displayedColumns = ['number', 'state' ,'date', 'VAN', 'TIR', 'COK', 'loan', 'interest', 'totalFees', 'actions']
  constructor(private router: Router,
              private entryService: EntryService,
              private loanService: LoanService) {
  }

  goToSignIn(){
    this.router.navigate(['/signIn'])
  }

  ngOnInit(): void {
    this.entryService.getUser().subscribe({
      next:data=>{
        this.user = data
        this.client = `${data.name} ${data.lastName}`
      }
    })
    this.loanService.getLoansByUserId(this.user.id).subscribe((response)=>{
      if(!response.isEmpty){
        this.loans = response
      }
    })
  }

  print(loan: any, index: number) {
    let doc = new jsPDF();
    let arrayFees: any = []
    let headers = ["N°", "Saldo Inicial", "Interés", "Cuota", "Amortización", "Saldo Final", "Flujo"]
    let number = 1
    let TEA = loan.TEA
    let TEP = loan.TEP
    let gracePeriod = loan.gracePeriod
    let price = loan.price
    let initialBalance = loan.loanAmount
    let interests = TEP * initialBalance
    let creditLifeInsuranceRate = loan.creditLifeInsuranceRate
    let creditLifeInsurance = creditLifeInsuranceRate * initialBalance
    let feesPerYear = loan.feesPerYear
    let totalFees = loan.totalFees
    let fee = (initialBalance * (TEP + creditLifeInsuranceRate))/(1-(1+(TEP + creditLifeInsuranceRate))**-totalFees)
    let amortization = fee - interests - creditLifeInsurance
    let vehicleInsuranceRate = loan.vehicleInsuranceRate
    let vehicleInsurance = vehicleInsuranceRate * price / feesPerYear
    let commission = loan.commission
    let portage = loan.portage
    let administrativeExpenses = loan.administrativeExpenses
    let finalBalance = initialBalance - amortization
    let flow = (fee + vehicleInsurance + commission + portage + administrativeExpenses)*-1
    let firstFee: Fee = {
      number: number,
      TEA: TEA,
      TEP: TEP,
      gracePeriod: gracePeriod,
      initialBalance: initialBalance,
      interests: interests,
      fee: fee,
      amortization: amortization,
      creditLifeInsurance: creditLifeInsurance,
      vehicleInsurance: vehicleInsurance,
      commission: commission,
      portage: portage,
      administrativeExpenses: administrativeExpenses,
      finalBalance: finalBalance,
      flow: flow
    }
    arrayFees.push(firstFee)
    for (let i = 0; i<totalFees-1; i++){
      number = number + 1;
      initialBalance = arrayFees[i].finalBalance;
      interests = TEP * initialBalance;
      creditLifeInsurance = creditLifeInsuranceRate * initialBalance;
      amortization = fee - interests - creditLifeInsurance;
      finalBalance = initialBalance - amortization;
      let newFee: Fee = {
        number: number,
        TEA: TEA,
        TEP: TEP,
        gracePeriod: gracePeriod,
        initialBalance: initialBalance,
        interests: interests,
        fee: fee,
        amortization: amortization,
        creditLifeInsurance: creditLifeInsurance,
        vehicleInsurance: vehicleInsurance,
        commission: commission,
        portage: portage,
        administrativeExpenses: administrativeExpenses,
        finalBalance: finalBalance,
        flow: flow
      }
      arrayFees.push(newFee);
    }
    if(loan.state == "ENTREGADO" || loan.state == "DEVUELTO" || loan.state == "RENOVADO"){
      let lastFlow = (loan.finalFee + vehicleInsurance + commission + portage + administrativeExpenses)*-1
      let newFee: Fee = {
        number: number + 1,
        TEA: TEA,
        TEP: TEP,
        gracePeriod: gracePeriod,
        initialBalance: 0,
        interests: .0,
        fee: 0,
        amortization: 0,
        creditLifeInsurance: 0,
        vehicleInsurance: vehicleInsurance,
        commission: commission,
        portage: portage,
        administrativeExpenses: administrativeExpenses,
        finalBalance: 0,
        flow: lastFlow
      }
      arrayFees.push(newFee)
    }
    let formattedArrayFees = arrayFees.map((fee: any) => [
      fee.number,
      fee.initialBalance.toFixed(2),
      fee.interests.toFixed(2),
      fee.fee.toFixed(2),
      fee.amortization.toFixed(2),
      fee.finalBalance.toFixed(2),
      fee.flow.toFixed(2)
    ]);

    autoTable(doc, {
      head: [headers],
      body: formattedArrayFees
    });

    doc.save('Plan de pago ' + this.client + index + '.pdf')
  }

  view(loan:any) {
    this.entryService.setLoanDetails(loan)
    this.router.navigate(['/plan'])
  }
}
