import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { delay, map, lastValueFrom } from 'rxjs';
//5c70d697f3b115912447a3065e90b28a69392271de80403eb2548a0f94126295

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  one_year: number;
  three_years:number;
  five_years:number;
  __month: number;
  __week: number;
  __day: number;
  __extractedValue: any;
  __historicValues: any;

  constructor(private http: HttpClient) {
    this.one_year = 31536000;
    this.three_years = 94694400;
    this.five_years = 157766400;
    this.__month = 2678400;
    this.__week = 604800;
    this.__day = 86400;
    this.__extractedValue = 0;
    this.__historicValues = [];
  }

  //Försökte använda genom this.global.add_favourite_base, men då var global private?
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

  async get_Price(crypto_coins: string, currencies: string) {
    return lastValueFrom(this.http.get("https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + crypto_coins + "&tsyms=" + currencies +
      "&?api_key=782d4b99733edef71cd914c6aa22ce9de82438f9fc3b37e716b0a97f65a8e4a7"))
  }

  convert_date_to_unix(YYYYMMDD: string): number {
    return Number(new Date(YYYYMMDD).getTime() / 1000);
  }

  async get_histroic(fromCurrency: string, toCoin: string, startDate: string, endDate: string) {
    this.__historicValues = [];
    let start_time_unix: number = this.convert_date_to_unix(startDate);
    let end_time_unix: number = this.convert_date_to_unix(endDate);
    let interval: number = end_time_unix - start_time_unix;
    console.log(interval)
    if (interval == this.__week) {
      console.log("Week")
      for (let i = start_time_unix; i < end_time_unix; i += this.__day) {
        let value = this.get_from_date(fromCurrency, toCoin, i.toString())
        await value.then(resp => {
          this.__historicValues.push(Object.values(resp)[0][fromCurrency])
        })
      }
    } else if (interval>=2419200 &&interval <= this.__month) {
      console.log("Month")
      for (let i = start_time_unix; i <= end_time_unix; i += 2 * this.__day) {
        let value = this.get_from_date(fromCurrency, toCoin, i.toString())
        await value.then(resp => {
          this.__historicValues.push(Object.values(resp)[0][fromCurrency])
        })
      }
    } else if (interval == this.one_year) {
      console.log("year")
      for (let i = start_time_unix; i <= end_time_unix; i += this.__month) {
        let value = this.get_from_date(fromCurrency, toCoin, i.toString())
        await value.then(resp => {
          this.__historicValues.push(Object.values(resp)[0][fromCurrency])
        })
      }
    } else if (interval == this.three_years) {
      console.log("3 years")
      for (let i = start_time_unix; i <= end_time_unix+this.__month; i += 4 * this.__month) {
        let value = this.get_from_date(fromCurrency, toCoin, i.toString())
        await value.then(resp => {
          this.__historicValues.push(Object.values(resp)[0][fromCurrency])
        })
      }
    } else if (interval == this.five_years) {
      console.log("5 years")
      for (let i = start_time_unix; i <= end_time_unix+this.one_year; i += 6 * this.__month) {
        let value = this.get_from_date(fromCurrency, toCoin, i.toString())
        await value.then(resp => {
          this.__historicValues.push(Object.values(resp)[0][fromCurrency])
        })
      }
    } else if (interval > this.five_years){
      console.log('+5 years')
      for (let i = start_time_unix; i <= end_time_unix+this.one_year; i +=  this.one_year) {
        let value = this.get_from_date(fromCurrency, toCoin, i.toString())
        await value.then(resp => {
          this.__historicValues.push(Object.values(resp)[0][fromCurrency])
        })
      }
    }
     else {
      console.log("this year")
      if (interval <= this.__week) {
        for (let i = start_time_unix; i <= end_time_unix; i += this.__day) {
          let value = this.get_from_date(fromCurrency, toCoin, i.toString())
          await value.then(resp => {
            this.__historicValues.push(Object.values(resp)[0][fromCurrency])
          })
        }
      } else if (this.__week < interval && interval <= this.__month) {
        for (let i = start_time_unix; i <= end_time_unix; i += 2 * this.__day) {
          let value = this.get_from_date(fromCurrency, toCoin, i.toString())
          await value.then(resp => {
            this.__historicValues.push(Object.values(resp)[0][fromCurrency])
          })
        }
      } else if (this.__month < interval && interval <= 3*this.__month){
      for (let i = start_time_unix; i <= end_time_unix; i += 4 * this.__day) {
        let value = this.get_from_date(fromCurrency, toCoin, i.toString())
        await value.then(resp => {
          this.__historicValues.push(Object.values(resp)[0][fromCurrency])
        })
      }
    } else if (this.__month*3 < interval && interval <= 6*this.__month) {
      for (let i = start_time_unix; i <= end_time_unix; i += this.__week) {
        let value = this.get_from_date(fromCurrency, toCoin, i.toString())
        await value.then(resp => {
          this.__historicValues.push(Object.values(resp)[0][fromCurrency])
        })
      } 
    } else {
      for (let i = start_time_unix; i <= end_time_unix; i += this.__month) {
        let value = this.get_from_date(fromCurrency, toCoin, i.toString())
        await value.then(resp => {
          this.__historicValues.push(Object.values(resp)[0][fromCurrency])
        })
      }
    }

  }
    return this.__historicValues;

  }

  async get_daily(fromCurrency: string, toCoin: string) {
    return lastValueFrom(this.http.get("https://min-api.cryptocompare.com/data/v2/histohour?fsym=" + toCoin + "&tsym=" + fromCurrency + "&limit=24"
      + "&?api_key=5c70d697f3b115912447a3065e90b28a69392271de80403eb2548a0f94126295"))
  }

  async get_from_date(fromCurrency: string, toCoin: string, date: string) {
    return lastValueFrom(this.http.get("https://min-api.cryptocompare.com/data/pricehistorical?fsym=" + toCoin + "&tsyms=" + fromCurrency + "&ts=" + date
      + "&?api_key=5c70d697f3b115912447a3065e90b28a69392271de80403eb2548a0f94126295").pipe(delay(50)))
  }

  //Denna funktionen är inte färdig än försöker extrakta själva coinen och sen när den har funnits på exchange
  coins() {
   return this.http.get("https://min-api.cryptocompare.com/data/blockchain/list"
      + "?api_key=5c70d697f3b115912447a3065e90b28a69392271de80403eb2548a0f94126295")
  }

  async coinsGraph() {
    return lastValueFrom(this.http.get("https://min-api.cryptocompare.com/data/blockchain/list"
      + "?api_key=5c70d697f3b115912447a3065e90b28a69392271de80403eb2548a0f94126295"))
  }
}
