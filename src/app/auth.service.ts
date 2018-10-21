import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user;

  constructor(
    private auth: AngularFireAuth, 
    private afs: AngularFirestore) {

    auth.authState
      .pipe(
        map(user => {
          return user ? {
            name: user.displayName,
            email: user.email,
            uid: user.uid,
            image: user.photoURL
          } : null;
        })).subscribe(user => {
          
          this.user = user;
          if (user) {
            
          } else {
            
          }      
        })
    

  }
}
