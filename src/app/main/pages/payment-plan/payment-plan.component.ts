import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EntryService} from "../../services/entry.service";
import {LoanService} from "../../services/loan.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";

export interface Fee {
  number: number;
  TEA: number;
  TEP: number;
  gracePeriod: string;
  initialBalance: number;
  interests: number;
  fee: number;
  amortization: number;
  creditLifeInsurance: number;
  vehicleInsurance: number;
  commission: number;
  portage: number;
  administrativeExpenses: number;
  finalBalance: number;
  flow: number;
}

@Component({
  selector: 'app-payment-plan',
  templateUrl: './payment-plan.component.html',
  styleUrls: ['./payment-plan.component.css']
})
export class PaymentPlanComponent implements OnInit{

  constructor(private router: Router,
              private entryService: EntryService,
              private loanService: LoanService,
              public dialog: MatDialog) {
  }

  displayedColumns: string[] = ['number', 'TEA', 'TEP', 'gracePeriod', 'initialBalance', 'interests', 'fee',
  'amortization', 'creditLifeInsurance', 'vehicleInsurance', 'commission', 'portage', 'administrativeExpenses',
  'finalBalance', 'flow'];
  arrayFees: Fee[] = []
  dataSource = this.arrayFees
  loanDetails:any = {}
  COKRate = 0
  VAN = 0
  TIR = 0
  TCEA = 0
  ngOnInit(): void {
    this.entryService.getLoanDetails().subscribe({
      next: data =>{
        this.loanDetails = data
      }
    })
    this.COKRate = this.loanDetails.cokRate
    let firstFlow = this.loanDetails.loanAmount
    let flows = []
    let number = 1
    let TEA = this.loanDetails.TEA
    let TEP = this.loanDetails.TEP
    let gracePeriod = this.loanDetails.gracePeriod
    let price = this.loanDetails.price
    let initialBalance = this.loanDetails.balanceFinance
    let interests = TEP * initialBalance
    let creditLifeInsuranceRate = this.loanDetails.creditLifeInsuranceRate
    let creditLifeInsurance = creditLifeInsuranceRate * initialBalance
    let feesPerYear = this.loanDetails.feesPerYear
    let totalFees = this.loanDetails.totalFees
    let fee = (initialBalance * (TEP + creditLifeInsuranceRate))/(1-(1+(TEP + creditLifeInsuranceRate))**-totalFees)
    let amortization = fee - interests - creditLifeInsurance
    let vehicleInsuranceRate = this.loanDetails.vehicleInsuranceRate
    let vehicleInsurance = vehicleInsuranceRate * price / feesPerYear
    let commission = this.loanDetails.commission
    let portage = this.loanDetails.portage
    let administrativeExpenses = this.loanDetails.administrativeExpenses
    let finalBalance = initialBalance - amortization
    let flow = (fee + vehicleInsurance + commission + portage + administrativeExpenses)*-1
    flows.push(firstFlow)
    flows.push(flow)
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
    this.arrayFees.push(firstFee)
    for (let i = 0; i<totalFees-1; i++){
      number = number + 1;
      initialBalance = this.arrayFees[i].finalBalance;
      interests = TEP * initialBalance;
      creditLifeInsurance = creditLifeInsuranceRate * initialBalance;
      amortization = fee - interests - creditLifeInsurance;
      finalBalance = initialBalance - amortization;
      flows.push(flow)
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
      this.arrayFees.push(newFee);
    }
    let lastFlow = (this.loanDetails.finalFee + vehicleInsurance + commission + portage + administrativeExpenses)*-1
    flows.push(lastFlow)
    if(this.loanDetails.state == "ENTREGADO" || this.loanDetails.state == "DEVUELTO" || this.loanDetails.state == "RENOVADO"){
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
      this.arrayFees.push(newFee)
    }
    this.dataSource = this.arrayFees
    this.COKRate = (1 + this.COKRate)**(1/12)-1
    if(this.loanDetails.state == "RENOVADO" || this.loanDetails.state == "")
    {
      this.TIR = this.calculateIRR(flows);
      this.VAN = this.calculateVAN(flows, this.COKRate)
    }
    else{
      this.TIR = this.loanDetails.TIR
      this.VAN = this.loanDetails.VAN
    }
    this.TCEA = (1+this.TIR)**12 - 1
  }

  calculateIRR(values: number[]) {
    // Credits: algorithm inspired by Apache OpenOffice

    // Calculates the resulting amount
    let irrResult = function(values: number[], dates: number[], rate: number) {
      let r = rate + 1;
      let result = values[0];
      for (let i = 1; i < values.length; i++) {
        result += values[i] / Math.pow(r, (dates[i] - dates[0]) / 365);
      }
      return result;
    }

    // Calculates the first derivation
    let irrResultDeriv = function(values: number[], dates: number[], rate: number) {
      let r = rate + 1;
      let result = 0;
      for (let i = 1; i < values.length; i++) {
        let frac = (dates[i] - dates[0]) / 365;
        result -= frac * values[i] / Math.pow(r, frac + 1);
      }
      return result;
    }

    // Initialize dates and check that values contains at least one positive value and one negative value
    let dates: number[] =[];
    let positive = false;
    let negative = false;
    for (let i = 0; i < values.length; i++) {
      dates[i] = (i === 0) ? 0 : dates[i - 1] + 365;
      if (values[i] > 0) positive = true;
      if (values[i] < 0) negative = true;
    }

    // Return error if values does not contain at least one positive value and one negative value
    if (!positive || !negative) return 0;

    // Initialize guess and resultRate
    let resultRate = 0.1;

    // Set maximum epsilon for end of iteration
    let epsMax = 1e-10;

    // Set maximum number of iterations
    let iterMax = 50;

    // Implement Newton's method
    let newRate, epsRate, resultValue;
    let iteration = 0;
    let contLoop = true;
    do {
      resultValue = irrResult(values, dates, resultRate);
      newRate = resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
      epsRate = Math.abs(newRate - resultRate);
      resultRate = newRate;
      contLoop = (epsRate > epsMax) && (Math.abs(resultValue) > epsMax);
    } while(contLoop && (++iteration < iterMax));

    if(contLoop) return 0;

    // Return internal rate of return
    return resultRate;
  }

  calculateVAN(values: number[], COKRate: number){
    let result = 0
    let investment = values[0]
    for (let i = 1; i < values.length; i++) {
      result += values[i] / Math.pow((1 + COKRate), i);
    }
    result = result + investment;
    return result
  }

  setStateOrVan(){
    if(this.loanDetails.id){
      this.loanDetails.VAN = this.VAN
      this.loanDetails.TIR = this.TIR
      if(this.loanDetails.state != "RENOVADO"){
        this.loanDetails.state = "PAGANDO"
      }
      this.loanService.putLoanById(this.loanDetails.id, this.loanDetails).subscribe(() =>{
        if(this.loanDetails.state != "RENOVADO"){
          this.entryService.setLoanDetails(this.loanDetails)
        }
        else{
          this.entryService.setLoanDetails(0)
        }
        this.router.navigate(['/home/history'])
      })
    }
    else{
      let loan:any = {};
      this.loanService.getLoansByUserId(this.loanDetails.userId).subscribe((response)=>{
        loan = response[response.length-1];
        loan.VAN = this.VAN
        loan.TIR = this.TIR
        if(loan.state!="RENOVADO"){
          loan.state = "PAGANDO"
        }
        this.loanService.putLoanById(loan.id, loan).subscribe(() =>{
          if(loan.state!="RENOVADO"){
            this.entryService.setLoanDetails(loan)
          }
          else{
            this.entryService.setLoanDetails(0)
          }
          this.router.navigate(['/home/history'])
        })
      })
    }
  }
  goToSimulator(){
    if(this.loanDetails.state == "" || this.loanDetails.VAN == 0){
      this.setStateOrVan()
    }
    else{
      if(this.loanDetails.state=="RENOVADO"){
        this.entryService.setLoanDetails(0)
      }
      this.router.navigate(['/home/history'])
    }
  }

  changeStatusToPending(){
    this.loanDetails.state = "PENDIENTE"
    this.loanService.putLoanById(this.loanDetails.id, this.loanDetails).subscribe(() =>{
      this.entryService.setLoanDetails(this.loanDetails)
    })
  }

  showDialog(){
    this.dialog.open(ActionDialogComponent);
  }
}

@Component({
  selector: 'app-action-dialog',
  templateUrl: 'action-dialog.component.html'
})
export class ActionDialogComponent implements OnInit{

  loan: any = {}
  actualPrice = 0
  sure = false
  constructor(private router: Router,
              private entryService: EntryService,
              private loanService: LoanService,
              private toastService: ToastrService) {
  }

  ngOnInit(): void {
    this.entryService.getLoanDetails().subscribe((response)=>{
      this.loan = response;
    })
  }

  changingSure(){
    this.sure = this.actualPrice >= this.loan.finalFee
  }
  changeStateToStay() {
    this.loan.state = "ENTREGADO"
    this.loanService.putLoanById(this.loan.id, this.loan).subscribe()
  }

  changeStateToRenew(){
    this.loan.state = "RENOVADO"
  }

  changeStateToPending(){
    this.loan.state = "PENDIENTE"
    this.sure = false
  }

  changeStateToReturned(){
    this.loan.state = "DEVUELTO"
  }

  goToSimulator(){
    if(this.actualPrice <= this.loan.finalFee){
      if(!this.sure){
        this.sure = true
        this.toastService.warning("Se establecerá como DEVUELTO, pague la diferencia y podrá financiar un nuevo auto. " +
          "Vuelva a presionar continuar para proceder", "Valor actual menor que deuda")
      }
      else{
        this.loan.finalFee = this.loan.finalFee - this.actualPrice
        this.changeStateToReturned()
        this.loanService.putLoanById(this.loan.id, this.loan).subscribe(() =>{
          this.router.navigate(['/home/simulator'])
        })
      }
    }
    else{
      this.loanService.putLoanById(this.loan.id, this.loan).subscribe(() =>{
        this.actualPrice = this.actualPrice - this.loan.finalFee
        this.entryService.setActualPrice(this.actualPrice)
        this.router.navigate(['/home/simulator'])
      })
    }
  }

    goToHistory(){
    this.loan.finalFee = this.loan.finalFee - this.actualPrice
    this.loanService.putLoanById(this.loan.id, this.loan).subscribe(() =>{
      this.router.navigate(['/home/history'])
    })
  }
}
