import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {EntryService} from "../../services/entry.service";
import {MatDialog} from "@angular/material/dialog";
import {CarsService} from "../../services/cars.service";
import {ToastrService} from "ngx-toastr";
import {LoanService} from "../../services/loan.service";

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent implements OnInit{

  //Client information
  user:any = {}
  client = ""
  loanToRenew:any = {}
  actualPrice = 0
  newPrice = 0
  formattedNewPrice = "S/0"

  constructor(private router: Router,
              private entryService: EntryService,
              public dialog: MatDialog,
              private toastService: ToastrService,
              private loanService: LoanService) {
  }


  [key: string]: any;


  //Currency information
  currencySelected = 'Soles'
  currencySymbol = 'S/'

  //Rates information
  COKrate = "32%"
  interestTypeSelected = "Nominal"
  _interestAnualRate = ""
  get interestAnualRate(): string {
    return this._interestAnualRate;
  }
  set interestAnualRate(value: string) {
    this._interestAnualRate = value;
    this.updateInterestRate();
  }
  _capitalizationPeriod = "1"
  get capitalizationPeriod(): string {
    return this._capitalizationPeriod;
  }
  set capitalizationPeriod(value: string) {
    this._capitalizationPeriod = value;
    this.updateInterestRate();
  }

  //Price information
  price = 0
  formattedPrice = "S/0"

  //Loan information
  initialFeePercent = "20"
  initialFee = 0
  formattedInitialFee = "S/0"
  finalFeePercent = "40"
  finalFee = 0
  formattedFinalFee = "S/0"
  plan = "24";
  gracePeriod = "S"
  graceMonths = 0
  state = ""

  //Initial costs
  _notarialCost: string = '0';
  get notarialCost(): string {
    return this._notarialCost;
  }
  set notarialCost(value: string) {
    this._notarialCost = value;
    this.updateLoanAmount();
  }
  _appraisal = '0'
  get appraisal(): string {
    return this._appraisal;
  }
  set appraisal(value: string) {
    this._appraisal = value;
    this.updateLoanAmount();
  }
  _registrationCosts = '0'
  get registrationCosts(): string {
    return this._registrationCosts;
  }
  set registrationCosts(value: string) {
    this._registrationCosts = value;
    this.updateLoanAmount();
  }
  _studyCommission = '0'
  get studyCommission(): string {
    return this._studyCommission;
  }
  set studyCommission(value: string) {
    this._studyCommission = value;
    this.updateLoanAmount();
  }
  _activationFee = '0'
  get activationFee(): string {
    return this._activationFee;
  }
  set activationFee(value: string) {
    this._activationFee = value;
    this.updateLoanAmount();
  }

  //Periodic expenses
  periodicComission = 0
  administrationExpenses = 0
  portage = 0
  creditLifeInsurance = 0
  vehicleInsurance = 0
  vehicleInsurancePeriod = "12"
  financialEntity = ""

  //Results
  TEA = 0
  TEM = 0
  numberFeesYear = 12
  numberFeesTotal = 24
  loanAmount = 0
  formattedLoanAmount = "S/0"
  balanceFinance = 0
  formattedBalanceFinance = "S/0"

  showDialaog(){
    const dialogRef = this.dialog.open(CarDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result !== ""){
        this.currencySelected = 'Soles';
        this.currencySymbol = 'S/';
        this.price = result.price
        if(this.actualPrice){
          this.newPrice = this.price - this.actualPrice
          this.formattedNewPrice = this.formatLabel(this.newPrice)
        }
        this.formattedPrice = this.formatLabel(this.price)
        this.setInitialFee()
        this.formattedInitialFee = this.formatLabel(this.initialFee);
        this.setFinalFee()
        this.formattedFinalFee = this.formatLabel(this.finalFee);
        this.updateLoanAmount();
      }
    })
  }
  updateLoanAmount(): void {
    this.loanAmount = this.actualPrice?this.newPrice + Number(this.notarialCost) +
      Number(this.appraisal) + Number(this.registrationCosts) + Number(this.studyCommission) +
      Number(this.activationFee) - Number(this.initialFee):
      this.price + Number(this.notarialCost) +
      Number(this.appraisal) + Number(this.registrationCosts) + Number(this.studyCommission) +
      Number(this.activationFee) - Number(this.initialFee);
    this.formattedLoanAmount = this.formatLabel(this.loanAmount);
    this.balanceFinance = this.loanAmount - this.finalFee/((1+this.TEM+this.creditLifeInsurance)**(this.numberFeesTotal + 1));
    this.formattedBalanceFinance = this.formatLabel(this.balanceFinance);
  }

  updateInterestRate(){
    if(this.interestTypeSelected == 'Nominal'){
      this.TEA = ((1 + (parseFloat(this.interestAnualRate.replace('%', '')))/100
        /(360/Number(this.capitalizationPeriod))) ** (360/Number(this.capitalizationPeriod)) - 1);
    }
    else {
      this.TEA = parseFloat(this.interestAnualRate.replace('%', ''))/100;
    }
    this.TEM = ((1 + this.TEA)
      ** (1/12) - 1)
    this.updateLoanAmount();
  }

  formatLabel = (value: number): string => {
    return `${this.currencySymbol}${Number(value.toFixed(2)).toLocaleString('en-US')}`;
  }
  setCurrencyToDollars() {
    this.price = this.currencySelected=='Soles'?this.price/3.2:this.price;
    this.currencySelected = 'Dolares';
    this.currencySymbol = '$';
    this.formattedPrice = this.formatLabel(this.price);
    if(this.actualPrice){
      this.newPrice = this.currencySelected=='Soles'?this.newPrice/3.2:this.newPrice;
      this.formattedNewPrice = this.formatLabel(this.newPrice)
    }
    this.setInitialFee()
    this.formattedInitialFee = this.formatLabel(this.initialFee);
    this.setFinalFee()
    this.formattedFinalFee = this.formatLabel(this.finalFee);
    this.updateLoanAmount();
  }
  setCurrencyToSoles() {
    this.price = this.currencySelected=='Dolares'?this.price*3.2:this.price;
    this.currencySelected = 'Soles';
    this.currencySymbol = 'S/';
    this.formattedPrice = this.formatLabel(this.price);
    if(this.actualPrice){
      this.newPrice = this.currencySelected=='Dolares'?this.newPrice*3.2:this.newPrice;
      this.formattedNewPrice = this.formatLabel(this.newPrice)
    }
    this.setInitialFee()
    this.formattedInitialFee = this.formatLabel(this.initialFee);
    this.setFinalFee()
    this.formattedFinalFee = this.formatLabel(this.finalFee);
    this.updateLoanAmount();
  }
  setInterestToNominal(){
    this.interestTypeSelected = 'Nominal';
    this.updateInterestRate();
  }

  setInterestToEfectiva(){
    this.interestTypeSelected = 'Efectiva';
    this.updateInterestRate();
  }

  setInitialFreePercentTo20(){
    this.initialFeePercent = "20";
    this.setInitialFee()
    this.formattedInitialFee = this.formatLabel(this.initialFee);
    this.updateLoanAmount();
  }

  setInitialFreePercentTo30(){
    this.initialFeePercent = "30";
    this.setInitialFee()
    this.formattedInitialFee = this.formatLabel(this.initialFee);
    this.updateLoanAmount();
  }

  setFinalFreePercentTo40() {
    this.finalFeePercent = "40";
    this.setFinalFee()
    this.formattedFinalFee = this.formatLabel(this.finalFee)
    this.updateLoanAmount()
  }

  setFinalFreePercentTo50() {
    this.finalFeePercent = "50";
    this.setFinalFee()
    this.formattedFinalFee = this.formatLabel(this.finalFee)
    this.updateLoanAmount()
  }

  setPlanTo24(){
    this.plan = "24";
    this.numberFeesTotal = Number(this.plan);
    this.updateLoanAmount();
  }

  setPlanTo36(){
    this.plan = "36";
    this.numberFeesTotal = Number(this.plan);
    this.updateLoanAmount();
  }

  setInitialFee(){
    let percent = Number(this.initialFeePercent)
    this.initialFee = this.actualPrice?this.newPrice * percent / 100:this.price * percent / 100;
  }

  setFinalFee(){
    let percent = Number(this.finalFeePercent)
    this.finalFee = this.actualPrice?this.newPrice * percent / 100:this.price * percent / 100;
  }

  onBlur(propertyName: string) {
    let rate = Number(this[propertyName]);
    if (!isNaN(rate)) {
      this[propertyName] = rate + '%';
    } else {
      this[propertyName] = '';
    }
  }

  goToSignIn(){
    this.router.navigate(['/signIn'])
  }

  checkOutError():string{
    let errorType = ""
    if(this.COKrate == "" || this.COKrate == "0%"){
      errorType = "cokRate"
      return errorType;
    }
    if(this.price == 0){
      errorType = "price"
      return errorType
    }
    if(this.financialEntity == ""){
      errorType = "financialEntity"
    }
    if(this._interestAnualRate == "" || this._interestAnualRate == "0%"){
      errorType = "interestAnualRate"
    }
    if(errorType != ""){
      return errorType
    }
    else{
      return errorType;
    }
  }
  goToPlan(){
    let errorType = this.checkOutError()

    switch (errorType){
      case "cokRate":
        this.toastService.error("Debe proporcionar una tasa de descuento", "Error")
        break;
      case "price":
        this.toastService.error("Debe elegir un auto para obtener el precio", "Error")
        break;
      case "financialEntity":
        this.toastService.error("Debe elegir una entidad financiera", "Error")
        break;
      case "interestAnualRate":
        this.toastService.error("Debe proporcionar una tasa de interés", "Error")
        break;
      case "":
        let cokRateNumber= parseFloat(this.COKrate.replace("%", ""))/100
        let now = new Date();
        let formattedDate =
          ("0" + now.getDate()).slice(-2) + "/" +
          ("0" + (now.getMonth() + 1)).slice(-2) + "/" +
          now.getFullYear() + " " +
          ("0" + now.getHours()).slice(-2) + ":" +
          ("0" + now.getMinutes()).slice(-2) + ":" +
          ("0" + now.getSeconds()).slice(-2);
        let loanDetails = {
          cokRate: cokRateNumber,
          TEA: this.TEA,
          TEP: this.TEM,
          gracePeriod: this.gracePeriod,
          graceMonths: this.graceMonths,
          price: this.actualPrice?this.newPrice:this.price,
          balanceFinance: this.balanceFinance,
          loanAmount: this.loanAmount,
          creditLifeInsuranceRate: this.creditLifeInsurance,
          feesPerYear: this.numberFeesYear,
          totalFees: this.numberFeesTotal,
          vehicleInsuranceRate: this.vehicleInsurance,
          commission: this.periodicComission,
          portage: this.portage,
          administrativeExpenses: this.administrationExpenses,
          finalFee: this.finalFee,
          userId: this.user.id,
          VAN: 0,
          TIR: 0,
          date: formattedDate,
          state: this.state?this.state:""
        }
        if(this.actualPrice){
          this.loanService.putLoanById(this.loanToRenew.id, loanDetails).subscribe((response)=>{
            this.entryService.setLoanDetails(loanDetails)
            this.toastService.success("Plan de pago creado")
            this.router.navigate(['/plan'])
          })
        }
        else{
          this.loanService.postLoan(loanDetails).subscribe((response)=>{
            this.entryService.setLoanDetails(loanDetails)
            this.toastService.success("Plan de pago creado")
            this.router.navigate(['/plan'])
          })
        }
        break;
    }
  }

  ngOnInit(): void {

    this.entryService.getUser().subscribe({
      next:data=>{
        this.user = data
        this.client = `${data.name} ${data.lastName}`
      }
    })
    this.entryService.getLoanDetails().subscribe({
      next:loanDetails =>{
        console.log(loanDetails)
        this.loanToRenew = loanDetails
        this.state = this.loanToRenew.state
      }
    })
    if(this.state == "RENOVADO"){
      this.entryService.getActualPrice().subscribe({
        next:actualPrice =>{
          this.actualPrice = actualPrice
        }
      })
      this.loanToRenew.state = "PENDIENTE"
      this.loanService.putLoanById(this.loanToRenew.id, this.loanToRenew).subscribe()
    }
    else{
      this.state = ""
    }
  }

  onFinancialEntityChange(value: any) {
    switch (value){
      case "Scotiabank":
        this.notarialCost = "25"
        this.appraisal = "20"
        this.registrationCosts = "15"
        this.studyCommission = "10"
        this.activationFee = "5"
        this.periodicComission = 10
        this.administrationExpenses = 5
        this.portage = 2
        this.creditLifeInsurance = 0.0004
        this.vehicleInsurancePeriod = "12"
        this.vehicleInsurance = 0.001
        break;
      case "SmartBuy":
        this.notarialCost = "20"
        this.appraisal = "10"
        this.registrationCosts = "5"
        this.studyCommission = "15"
        this.activationFee = "20"
        this.periodicComission = 12
        this.administrationExpenses = 2
        this.portage = 5
        this.creditLifeInsurance = 0.0005
        this.vehicleInsurancePeriod = "12"
        this.vehicleInsurance = 0.0012
        break;
      case "CreditBank":
        this.notarialCost = "10"
        this.appraisal = "15"
        this.registrationCosts = "5"
        this.studyCommission = "18"
        this.activationFee = "23"
        this.periodicComission = 11
        this.administrationExpenses = 6
        this.portage = 3
        this.creditLifeInsurance = 0.0007
        this.vehicleInsurancePeriod = "12"
        this.vehicleInsurance = 0.002
        break;
      case "BancaRapida":
        this.notarialCost = "27"
        this.appraisal = "10"
        this.registrationCosts = "14"
        this.studyCommission = "5"
        this.activationFee = "2"
        this.periodicComission = 9
        this.administrationExpenses = 7
        this.portage = 5
        this.creditLifeInsurance = 0.0006
        this.vehicleInsurancePeriod = "12"
        this.vehicleInsurance = 0.001
        break;
    }
  }
}

@Component({
  selector: 'app-car-dialog',
  templateUrl: 'car-dialog.component.html'
})
export class CarDialogComponent implements OnInit{

  cars:any = []
  carSelected: any = {}
  constructor(private carsService: CarsService) {
  }

  ngOnInit(): void {
    this.carsService.getAllCars().subscribe((response) => {
      this.cars = response
    })
  }

  getCar(car: any) {
    this.carSelected = car;
  }
}
