declare const google: any;

import { FireawareService, Geoloc } from './../fireaware.service';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { FormControl } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

import { distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  geo: Geoloc = {
    lat: 10.316285,
    lng: 123.890829
  }

  geocode;

  zoom = 16;
  clicked = false;
  holdText = 'Send Report';
  cancelled = new Subject();

  searchControl = new FormControl();

  @ViewChild("search") public searchElementRef: ElementRef;

  constructor(
    private ngZone: NgZone,
    private aware: FireawareService,
    private af: AngularFirestore,
    private snack: MatSnackBar,
    private mapsAPILoader: MapsAPILoader) {

  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      this.aware.locChanged$
        .pipe(distinctUntilChanged())
        .subscribe(loc => {
          this.geo = loc;
          this.searchAdd(this.geo)
        });

      this.geocode = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"]
      });

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          console.log(place);
          //verify result
          if (!place.geometry) {
            return;
          }

          //set latitude, longitude and zoom
          console.log(place);
          this.geo = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          }
          this.zoom = 15;

        });
      });

    });

  }

  callBFP() {
    window.open('tel:911')
  }

  sendReport() {
    this.af.collection('firereports').add({
      geo: this.geo,
      user: this.aware.id,
      address: this.searchControl.value
    }).then(() => {
      this.holdText = 'Send Report';
      console.log('done');
      this.snack.open('Report Sent', null, { duration: 2000 })
    })
  }

  mapClick(event) {
    this.geo = event.coords;
    this.zoom = 15;
    this.searchAdd(this.geo);
  }

  searchAdd(coords) {
    this.geocode.geocode({ 'location': coords }, (result, status) => {
      if (status === 'OK') {

        let add = result[0].formatted_address;
        this.searchControl.setValue(add);
        this.zoom = 16;
      }
    })
  }

  searchAddress() {

  }

  clearAddress() {
    this.searchControl.setValue(null);
  }

  holdHandler(e) {
    this.clicked = true;
    this.holdText = 'Hold for 5 seconds to send report'
    if (e === 0) {
      this.clicked = false;
      this.holdText = 'Send Report';
    }

    if (e >= 5000) {
      this.holdText = 'Sending...';
      this.sendReport();
    }
    console.log(e);
  }

}
