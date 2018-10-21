import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

export interface Geoloc {
  lat: number,
  lng: number
}

@Injectable({
  providedIn: 'root'
})
export class FireawareService {

  geoLoc;
  locChanged$ = new Subject<Geoloc>();
  geo_options = {
    enableHighAccuracy: true,
    timeout           : 120000
  };

  id: string;

  constructor(private afs: AngularFirestore) { 
    this.getId();
    if(!('geoLocation' in navigator)) {
      navigator.geolocation.watchPosition(this.initLocation.bind(this), this.errLocation, this.geo_options);
    }
  }

  async getId(){
    let id = localStorage.getItem('sessionId');
    if(id) {
      this.id = id;
    } else {
      let sId = (await this.afs.createId()).toString();
      localStorage.setItem('sessionId', sId);
      this.id = sId;
    }
  }

  initLocation(position) {
    this.geoLoc = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    this.locChanged$.next(this.geoLoc);
  }

  errLocation(err) {
    console.log(err)
  }
}
