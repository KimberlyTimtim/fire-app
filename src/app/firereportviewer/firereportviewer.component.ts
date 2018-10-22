import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { Geoloc } from './../fireaware.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  newFire: Geoloc;
  newForm: FormGroup;

  updateforms: FormGroup[] = [];

  icon = {
    url: './assets/fire.svg',
    scaledSize: {
        width: 40,
        height: 40
    }
}

  zoom = 16;

  reports = [];

  verifiedFire = [];

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.initFireForm();
    this.afs.collection('firereports', ref => ref.where('status', '==', 'Reported')).valueChanges()
    .subscribe(reports => {
      this.reports = reports;
      
    })
    this.afs.collection('newfire', ref => ref.where('status', '==', 'Verified'))
    .snapshotChanges()
    .pipe(map(reports => {
      return reports.map(report => {
        return {
          ...report.payload.doc.data(), id: report.payload.doc.id
        }
      })
    }))
    .subscribe(reports => {
      reports.forEach(report => {
        this.newUpdateForms(report);
      });
      this.verifiedFire = reports;
    })
  }

  update(form: FormGroup, id: string) {
    let data = form.getRawValue();
    data.dateUpdated = new Date();
    
    this.afs.collection('newFire').doc(id).set(data, {merge: true})
  }

  newUpdateForms(report) {
    let form = new FormGroup({
      status: new FormControl(report.status),
      level: new FormControl(report.level),
    })
    this.updateforms.push(form);
  }

  mapClick(event) {
    this.geo = event.coords;
    this.newFire = event.coords;
    this.zoom = 15;

    // this.afs.collection('newfire').add({
    //   geo: this.geo,
    //   name: 'New Fire',
    //   status: 'Verified'
    // }).then(() => {
    //   console.log('done');
    // })
  }

  initFireForm() {
    this.newForm = new FormGroup({
      name: new FormControl(),
      status: new FormControl('Verified', Validators.required),
      radius: new FormControl(100 , Validators.required),
      level: new FormControl('Alpha' , Validators.required)
    })
  }

  createNewFire(marker){
    let data = this.newForm.getRawValue();
    data.dateCreated = new Date();
    data.geo = this.newFire;
    this.afs.collection('newfire').add(data).then(() => {
      this.newForm.reset();
      this.initFireForm();
    })
  }

}
