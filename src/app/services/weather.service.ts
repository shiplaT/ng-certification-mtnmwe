import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private weatherAPI: string =
    'https://api.openweathermap.org/data/2.5/weather?q=';
  private APIKey = '5a4b2d457ecbef9eb2a71e480b947604';
  private forecastAPI =
    'https://api.openweathermap.org/data/2.5/forecast/daily?zip=';

  private allImgPath = 'https://www.angulartraining.com/images/weather/';

  constructor(private httpClient: HttpClient) {}

  private weatherallImgs: any = {
    Clear: 'sun.png',
    Clouds: 'clouds.png',
    Rain: 'rain.png',
    Snow: 'snow.png',
  };

  getImgPath(): string {
    return this.allImgPath;
  }
  getWeaImg(): any {
    return this.weatherallImgs;
  }

  addData(zipCode: any): Observable<any> {
    let url =
      this.weatherAPI + zipCode + ',us&units=metric&appid=' + this.APIKey;
    return this.httpClient.get(url);
  }

  /// get weather data from server w.r.to zip code
  getWeatherData(zipCode: any): Observable<any> {
    let url =
      this.forecastAPI +
      zipCode +
      ',us&cnt=5&units=metric&appid=' +
      this.APIKey;
    return this.httpClient.get(url);
  }
}
