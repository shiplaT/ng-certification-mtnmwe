import { Component, OnInit } from '@angular/core';
import { WeatherService } from './../services/weather.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-app-weather',
  templateUrl: './app-weather.component.html',
  styleUrls: ['./app-weather.component.css'],
})
export class AppWeatherComponent implements OnInit {
  isLoader = false;
  weatherData = { zipcode: '', data: '', urlLink: '' };
  weatherDataArray: any[] = [];
  orgImgPath: any;
  weatherImg: any;

  constructor(private weatherService: WeatherService) {
    this.orgImgPath = this.weatherService.getImgPath();
    this.weatherImg = this.weatherService.getWeaImg();
  }

  ngOnInit() {
    let weatherData = JSON.parse(localStorage.getItem('weatherDetails'));
    this.weatherDataArray = weatherData || [];
  }

  weatherFormDetails = new FormGroup({
    zipcode: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{5}$'),
    ]),
  });

  getZipcode() {
    return this.weatherFormDetails.get('zipcode').value;
  }

  omit_special_char(event) {
    var k;
    k = event.charCode;
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }

  onSubmit() {
    this.isLoader = true;
    this.getWeatherDetails(this.getZipcode());
    this.weatherFormDetails.reset();
  }

  getWeatherDetails(zipcode) {
    this.weatherService.addData(zipcode).subscribe(
      (result) => {
        this.isLoader = false;
        this.setWeatherDetails(result,zipcode );
      },
      (error) => {
        console.log('error', error);
        this.isLoader = true;
        alert('Data not found,try with other zipcode');
      }
    );
  }

//set location weatherDetails about location
setWeatherDetails(result,zipcode ){
  this.weatherData.data = result;
  this.weatherData.zipcode = zipcode;
  this.weatherData.urlLink = 'forecast/' + this.weatherData.zipcode;
  console.log(this.weatherData.data);
  if (this.weatherData.data != null && this.weatherData.data != '') {
    let index = this.findById(this.weatherData.zipcode);
    if (index != -1) {
      this.weatherDataArray[index].zipcode = this.weatherData.zipcode;
      this.weatherDataArray[index].data = this.weatherData.data;
      localStorage.setItem(
        'weatherDetails',
        JSON.stringify(this.weatherDataArray)
      );
    } else {
      this.weatherData.urlLink = 'forecast/' + this.weatherData.zipcode;
      this.weatherDataArray.push(JSON.parse(JSON.stringify(this.weatherData)));
      localStorage.setItem(
        'weatherDetails',
        JSON.stringify(this.weatherDataArray)
      );
    }
  } else {
    alert('Data not found,try with other zipcode');
  }
}


//check index of zipcode available  
  findById(zipcode: any) {
    let index = this.weatherDataArray.findIndex((obj) => obj.zipcode == zipcode);
    return index;
  }

  /// remove item from current array and localStorage
  remove(index) {
    this.weatherDataArray.splice(index, 1);
    localStorage.setItem('weatherDetails', JSON.stringify(this.weatherDataArray));
  }
}
