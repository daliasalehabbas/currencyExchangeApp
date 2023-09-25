import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component'
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from '../global.service';
import { NgbModal, ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { map, Subscription, timer } from 'rxjs';
import { ThisReceiver } from '@angular/compiler';



@Component({
  selector: 'app-exchangeside',
  templateUrl: './exchangeside.component.html',
  styleUrls: ['./exchangeside.component.css'],
  providers: [NgbModalConfig, NgbModal]

})


export class ExchangesideComponent implements OnInit {
  
  currencies:Array<String>;
  cryptos:Array<String>;
  regForm:any;
  total:Number;
  alarmCurrencies: any;
  power: any;
  isCollapsed:boolean;
  isAlarmCollapsed:boolean;
  //timerSubscription: Subscription
  closeResult: any;
  base: any;
  messages:Array<String>;
  
  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder, private appcomponent: AppComponent, private global:GlobalService, config: NgbModalConfig, private modalService: NgbModal) {
    this.currencies=new Array();
    this.cryptos=new Array();
    this.total=0;
    this.alarmCurrencies= new Array();
    this.power = "";
    this.isCollapsed=true;
    this.isAlarmCollapsed = true;
    this.closeResult="";
    this.base= "BTC"
    this.messages=new Array();
   }

   getAllRates(){
   console.log("we are in")
   let response = this.appcomponent.method('').subscribe(res =>{  this.currencies = Object.keys(Object.create(res).rates) })
   console.log("currencies", this.currencies)

  //  console.log("abc",abc)

  //  let rates=Object.keys(Object.create(response).rates)
   }

   getValues(totals:string, from:string, to:string){
    this.isCollapsed=false;

    if(Number(totals) < 0){

    }else{
    console.log("toootal", totals, from, to, this.global.get_Price(from, to).then(x =>
      {this.total= Number(Object.values(Object.entries(x)[0][1])[0])*Number(totals) ,console.log("bre", this.total)}))
   }
  }

  loadAlarmData() {
    let obj = JSON.parse(localStorage.getItem('alarmObj') || '{}')
    if(localStorage.getItem('alarmObj')) {
      let currencies = Object.keys(obj)
      console.log('currencies this', this.alarmCurrencies)
      currencies.forEach(curr => {
        this.global.get_Price(curr, 'SEK').then(resp => 
          {
            console.log(curr, curr,Object.create(resp)[curr]['SEK'])
            if(obj[curr] <= Object.create(resp)[curr]['SEK']){
              console.log(
              this.soundTheAlarm(curr, obj[curr], Object.create(resp)[curr]['SEK'] ))

            }
          
          }
          )
      })      
    }
  }

  soundTheAlarm(currency:string, customerPrice:Number, actualPrice:Number){
    this.alarmCurrencies.push(currency)
    this.messages.push(currency + " is now higher or equal to "  + customerPrice +" SEK" + "\n" + "1 " + currency + " = " + actualPrice + " SEK")
    }

  ngOnInit(): void {
    this.getAllRates()
    this.appcomponent.fill_currencies().subscribe(rep => {this.cryptos=Object.keys(Object.values(rep)[5])})

    this.regForm=this.formBuilder.group({})
    this.loadAlarmData()
    // this.timerSubscription = timer(0, 10000).pipe( 
    //   map(() => { 
    //     this.loadAlarmData(); // load data contains the http request 
    //   }) 
    // ).subscribe();
  }
//work in progess
  // checkAlarm() {
  //   let obj = JSON.parse(localStorage.getItem('alarmObj') || '{}')
  //   if(localStorage.getItem('alarmObj'))
  //   Object.entries(this.alarmCurrencies).map(([curr, value], i) => {
  //     if (obj[curr] <= Number(value)) {
  //       return true;
  //     }
  //   })
  //   return false
  // }



  addToAlarmList(crypto: string, price: string) {
    let obj = JSON.parse(localStorage.getItem('alarmObj') || '{}')
    if(localStorage.getItem('alarmObj')) {
      obj[crypto] = price
      localStorage.setItem('alarmObj', JSON.stringify(obj))
    } else {
      obj = {[crypto]: price}
      localStorage.setItem('alarmObj', JSON.stringify(obj) )
    }
    // console.log('alarmobj',obj)
    window.location.reload();
  }

  toggleAlarm() {
    this.isAlarmCollapsed = !this.isAlarmCollapsed;
    // console.log('alarm currencies', this.alarmCurrencies)
    // console.log("messages", this.messages)

  }
  
  open(content:any) {
    this.modalService.open(content);
  }
  
  close(message: String) {
    let i =this.messages.indexOf(message)
    this.messages.splice(i, 1);
    let obj = JSON.parse(localStorage.getItem('alarmObj') || '{}')
    let crypto = this.alarmCurrencies[i]
    delete obj[crypto]
    localStorage.setItem('alarmObj', JSON.stringify(obj))

  }

}
