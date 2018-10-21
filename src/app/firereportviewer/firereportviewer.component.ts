import { AngularFirestore } from '@angular/fire/firestore';
import { Geoloc } from './../fireaware.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-firereportviewer',
  templateUrl: './firereportviewer.component.html',
  styleUrls: ['./firereportviewer.component.scss']
})
export class FirereportviewerComponent implements OnInit {

  geo: Geoloc = {
    lat: 10.316285,
    lng: 123.890829
  }

  zoom = 16;

  reports = [];

  verifiedFire = [];

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.afs.collection('firereports', ref => ref.where('status', '==', 'Reported')).valueChanges()
    .subscribe(reports => {
      console.log(reports)
      this.reports = reports;
    })
    this.afs.collection('newfire', ref => ref.where('status', '==', 'Verified')).valueChanges()
    .subscribe(reports => {
      console.log(reports)
      this.verifiedFire = reports;
    })

  }

  mapClick(event) {
    this.geo = event.coords;
    this.zoom = 15;
    this.afs.collection('newfire').add({
      geo: this.geo,
      name: 'New Fire',
      status: 'Verified'
    }).then(() => {
      console.log('done');
    })
  }

}
