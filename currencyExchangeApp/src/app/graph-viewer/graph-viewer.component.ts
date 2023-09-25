import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { Chart, registerables } from 'chart.js';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-graph-viewer',
  templateUrl: './graph-viewer.component.html',
  styleUrls: ['./graph-viewer.component.css']
})
export class GraphViewerComponent implements OnInit {
  WEEK = 7;
  MONTH = 30;
  YEAR = 365;
  currentDate: any;
  startDate: any;
  duration: any;
  chart_labels: any = [];
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months_nbr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  base: any;
  symbol: any;
  coin: any;
  currencies: any;
  cryptos: any;
  chart: any;
  historic_rates: any;

  constructor(private global: GlobalService) {
    this.currentDate = new Date();
    this.duration = 'default';
    this.startDate = "";
    this.base = '';
    this.currencies = ['USD', 'EUR', 'SEK'];
    this.cryptos = [];
    this.symbol = '';
    this.coin = [];
    Chart.register(...registerables);
  }

  async ngOnInit(): Promise<void> {
    this.fill_currencies()
    if(this.duration == 'default'){
      this.coin = ['BTC']
      this.symbol = 'BTC'
      this.base = 'USD'
       await this.get_daily_rates(this.base, this.symbol);
       this.get_24hour()
    }
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.chart_labels,
        datasets: [{
          label: 'Rates between ' + this.base + ' and ' + this.symbol,
          data: this.historic_rates,
          borderWidth: 3,
          fill: false,
          backgroundColor: 'rgb(75, 192, 192)',
          borderColor: 'rgb(75, 192, 192)'
        }]
      },
    })
  }

  get_24hour(){
    this.chart_labels = [];
    let current_time = new Date();
    let counter = 0; 
    this.chart_labels = [this.currentDate.toString().slice(16,18)]
    while (counter < 24){
      current_time.setTime(current_time.getTime()-3600*1000)
      this.chart_labels.push(current_time.toString().slice(16,18))
      counter++;
    }
    this.chart_labels.reverse()
  }

  async set_duration(interval: string) {
    this.duration = interval;
    if(this.duration != 'default'){
    if (this.duration.toLowerCase() == 'week') {
      this.startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate() - 7);
      this.set_labels();
      this.currentDate = formatDate(new Date(), 'yyyy.MM.dd', 'en');
      this.startDate = formatDate(this.startDate, 'yyyy.MM.dd', 'en');
      await this.get_historic_rates(this.base, this.symbol)
    } else if (this.duration.toLowerCase() == 'month') {
      this.startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, this.currentDate.getDate());
      this.set_labels();
      this.currentDate = formatDate(new Date(), 'yyyy.MM.dd', 'en');
      this.startDate = formatDate(this.startDate, 'yyyy.MM.dd', 'en');
      await this.get_historic_rates(this.base, this.symbol)
    } else if (this.duration.toLowerCase() == 'this year') {
      this.startDate = new Date(this.currentDate.getFullYear(), 0, 1);
      this.set_labels();
      this.currentDate = formatDate(new Date(), 'yyyy.MM.dd', 'en');
      this.startDate = formatDate(this.startDate, 'yyyy.MM.dd', 'en');
      await this.get_historic_rates(this.base, this.symbol)
    } else if (this.duration.toLowerCase() == '1 year') {
      this.startDate = new Date(this.currentDate.getFullYear() - 1, this.currentDate.getMonth(), this.currentDate.getDate());
      this.set_labels();
      this.currentDate = formatDate(new Date(), 'yyyy.MM.dd', 'en');
      this.startDate = formatDate(this.startDate, 'yyyy.MM.dd', 'en');
      await this.get_historic_rates(this.base, this.symbol)
    } else if (this.duration.toLowerCase() == '3 years') {
      this.startDate = new Date(this.currentDate.getFullYear() - 3, this.currentDate.getMonth(), this.currentDate.getDate());
      this.set_labels();
      this.currentDate = formatDate(new Date(), 'yyyy.MM.dd', 'en');
      this.startDate = formatDate(this.startDate, 'yyyy.MM.dd', 'en');
      await this.get_historic_rates(this.base, this.symbol)
    } else if (this.duration.toLowerCase() == '5 years') {
      this.startDate = new Date(this.currentDate.getFullYear() - 5, this.currentDate.getMonth(), this.currentDate.getDate());
      this.set_labels();
      this.currentDate = formatDate(new Date(), 'yyyy.MM.dd', 'en');
      this.startDate = formatDate(this.startDate, 'yyyy.MM.dd', 'en');
      await this.get_historic_rates(this.base, this.symbol)
    } else if (this.duration.toLowerCase() == 'all time') {
      this.startDate = new Date(2012, this.currentDate.getMonth(), this.currentDate.getDate());
      this.set_labels();
      this.currentDate = formatDate(new Date(), 'yyyy.MM.dd', 'en');
      this.startDate = formatDate(this.startDate, 'yyyy.MM.dd', 'en');
      await this.get_historic_rates(this.base, this.symbol)
    }} else {
    this.get_24hour();
    await this.get_daily_rates(this.base, this.symbol);
  }
    console.log(this.chart_labels)
    console.log(this.historic_rates)
    this.chart.data.datasets[0].label = 'Rates between ' + this.base + ' and ' + this.symbol;
    this.chart.data.labels = this.chart_labels;
    this.chart.data.datasets[0].data = this.historic_rates;
    this.chart.update();
    this.currentDate = new Date();

  }

  add_favourite_base(base: string) {
    if (base == '') {

    } else if (window.localStorage.getItem('base') == null) {
      window.localStorage.setItem('base', JSON.stringify([base]));
    } else if (!JSON.parse(<string> window.localStorage.getItem('base')).includes(base)) {
      var favBases = JSON.parse(<string> window.localStorage.getItem('base'));
      favBases.push(base);
      window.localStorage.setItem('base', JSON.stringify(favBases));
    }
  }

  get_favourite_bases() {
    return JSON.parse(<string> window.localStorage.getItem('base'))
  }

  remove_favourite_bases() {
    window.localStorage.removeItem('base');
  }

  add_favourite_symbol(symbol: string) {
    if (symbol == '') {

    } else if (window.localStorage.getItem('symbols') == null) {
      window.localStorage.setItem('symbols', JSON.stringify([symbol]));
    } else if (!JSON.parse(<string> window.localStorage.getItem('symbols')).includes(symbol)) {
      var favSymbols = JSON.parse(<string> window.localStorage.getItem('symbols'));
      favSymbols.push(symbol);
      window.localStorage.setItem('symbols', JSON.stringify(favSymbols));
    }
  }

  get_favourite_symbols() {
    return JSON.parse(<string> window.localStorage.getItem('symbols'))
  }

  remove_favourite_symbols() {
    window.localStorage.removeItem('symbols');
  }

  get_date_diff() {
    var diff = Math.abs(this.currentDate.getTime() - this.startDate.getTime());
    return Math.floor(diff / (1000 * 3600 * 24));
  }

  set_labels() {
    this.chart_labels = []
    let day = this.currentDate.getDay()
    let date = this.currentDate.getDate()
    let month = this.currentDate.getMonth()
    let year = this.currentDate.getFullYear()

    if (this.duration.toLowerCase() == 'week') {
      while (this.chart_labels.length < 7) {
        let temp_date = new Date(year, month, date)
        let date_string = this.days[(day % 7)] + " - " + temp_date.toString().slice(4, 15);
        this.chart_labels.push(date_string)
        day++;
        date--;
      }
    } else if (this.duration.toLowerCase() == 'month') {
      while (this.chart_labels.length < 15) {
        let temp_date = new Date(year, month, date)
        let date_string = this.days[(day % 7)] + " - " + temp_date.toString().slice(4, 15);
        this.chart_labels.push(date_string)
        day = day + 2;
        date = date - 2;
      }

    } else if (this.duration.toLowerCase() == 'this year') {
      let day_diff = this.get_date_diff();
      if (day_diff <= this.WEEK) {
        while (this.chart_labels.length < day_diff) {
          let temp_date = new Date(year, month, date)
          let date_string = this.days[(day % 7)] + " - " + temp_date.toString().slice(4, 15);
          this.chart_labels.push(date_string)
          day++;
          date--;
        }
      } else if (this.WEEK < day_diff && day_diff <= this.MONTH) {
        while (this.chart_labels.length < Math.ceil(day_diff / 2)) {
          let temp_date = new Date(year, month, date)
          let date_string = this.days[(day % 7)] + " - " + temp_date.toString().slice(4, 15);
          this.chart_labels.push(date_string)
          day = day + 2;
          date = date - 2;
        }
      } else if (this.MONTH < day_diff && day_diff <= 3 * this.MONTH) {
        while (this.chart_labels.length < Math.ceil(day_diff / 4)) {
          let temp_date = new Date(year, month, date)
          let date_string = this.days[(day % 7)] + " - " + temp_date.toString().slice(4, 15);
          this.chart_labels.push(date_string)
          day = day + 4;
          date = date - 4;
        }
      } else if (3 * this.MONTH < day_diff && day_diff <= 6 * this.MONTH) {
        while (this.chart_labels.length < Math.ceil(day_diff / 7)) {
          let temp_date = new Date(year, month, date)
          let date_string = this.days[(day % 7)] + " - " + temp_date.toString().slice(4, 15);
          this.chart_labels.push(date_string)
          day = day + 7;
          date = date - 7;
        }
      } else {
        while (this.chart_labels.length < Math.ceil(day_diff / 30)) {
          let temp_date = new Date(year, month, date)
          let date_string = this.days[(day % 7)] + " - " + temp_date.toString().slice(4, 15);
          this.chart_labels.push(date_string)
          day = day + 30;
          date = date - 30;
        }
      }

    } else if (this.duration.toLowerCase() == '1 year') {
      while (this.chart_labels.length < 12) {
        if (month == 0) {
          month = 11
          year--;
        }
        let temp_date = new Date(year, month, date)
        let date_string = this.months[(month % 12)] + " - " + temp_date.toString().slice(11, 15);
        this.chart_labels.push(date_string)
        month--;
      }
    } else if (this.duration.toLowerCase() == '3 years') {
      let temp_date = new Date(year, month, date)
      while (this.chart_labels.length < 10) {
        temp_date.setFullYear(year);
        let date_string = this.months[(month % 12)] + " - " + temp_date.toString().slice(11, 15);
        this.chart_labels.push(date_string)
        switch (month) {
          case 0:
            month = 8
            year--;
            break;
          case 1:
            month = 9
            year--;
            break;
          case 2:
            month = 10
            year--;
            break;
          case 3:
            month = 11
            year--;
            break;
          case 4:
            month = 0;
            break;
          case 5:
            month = 1;
            break;
          case 6:
            month = 2;
            break;
          case 7:
            month = 3;
            break;
          case 8:
            month = 4;
            break;
          case 9:
            month = 5;
            break;
          case 10:
            month = 6;
            break;
          case 11:
            month = 7;
            break;
        }
      }
    } else if (this.duration.toLowerCase() == '5 years') {
      let temp_date = new Date(year, month, date)
      while (this.chart_labels.length < 11) {
        temp_date.setFullYear(year)
        let date_string = this.months[(month % 12)] + " - " + temp_date.toString().slice(11, 15);
        this.chart_labels.push(date_string)
        switch (month) {
          case 0:
            month = 6
            year--;
            break;
          case 1:
            month = 7
            year--;
            break;
          case 2:
            month = 8
            year--;
            break;
          case 3:
            month = 9
            year--;
            break;
          case 4:
            month = 10;
            year--;
            break;
          case 5:
            month = 11;
            year--;
            break;
          case 6:
            month = 0;
            break;
          case 7:
            month = 1;
            break;
          case 8:
            month = 2;
            break;
          case 9:
            month = 3;
            break;
          case 10:
            month = 4;
            break;
          case 11:
            month = 5;
            break;
        }
      }
    } else if (this.duration.toLowerCase() == 'all time') {
      let temp_date = new Date(year, month, date)
      while (this.chart_labels.length < 12) {
        temp_date.setFullYear(year)
        let date_string = temp_date.toString().slice(11, 15);
        this.chart_labels.push(date_string)
        year--;
      }
    }
    this.chart_labels.reverse();
  }

  async GET_price_method(coins: string, currencies: string) {
    await this.global.get_Price(coins, currencies).then(resp => {
    })
  }

  async fill_currencies() {
    await this.global.coinsGraph().then(resp => {
      this.cryptos = (Object.keys(Object.values(resp)[5]));
    })
  }

  async get_historic_rates(currency: string, coin: string) {
    this.historic_rates = []
    
      await this.global.get_histroic(currency, coin, this.startDate, this.currentDate).then(resp => {
        this.historic_rates = resp
      }
      )
    }

  async get_daily_rates(currency: string, coin: string){
      this.historic_rates = [];
      await this.global.get_daily(currency, coin).then(resp => {
        for (let i = 0; i < Object.values(resp)[5].Data.length; i++) {
          this.historic_rates.push(Object.values(resp)[5].Data[i].open);
        }
      });

    }
}




