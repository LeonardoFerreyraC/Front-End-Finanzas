import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  isSimulatorSelected = true
  isHistorySelected = false
  actualRoute = '';

  constructor(private router: Router) {

  }
  goToSimulator(){
    this.router.navigate(['/home/simulator']);
    this.isSimulatorSelected = true;
    this.isHistorySelected = false;
  }

  goToHistory(){
    this.router.navigate(['/home/history']);
    this.isSimulatorSelected = false;
    this.isHistorySelected = true;
  }

  ngOnInit(){
    this.actualRoute = this.router.url;
    if(this.actualRoute == '/home/simulator')
    {
      this.isSimulatorSelected = true;
      this.isHistorySelected = false;
    }
    if(this.actualRoute == '/home/history')
    {
      this.isHistorySelected = true;
      this.isSimulatorSelected = false;
    }
  }
}
