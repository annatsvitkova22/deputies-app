import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'deputies-app';

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore
  ) { }

  async ngOnInit(): Promise<void> {
    // const provider = new auth.GoogleAuthProvider();
    // console.log('provider', provider);
    // const credential = await this.auth.signInWithPopup(provider);
    // console.log('credential', credential)
   
    const user = await auth().currentUser.getIdTokenResult(true);
    console.log('user', user);
    const doc = await this.db.collection('pages').add({dsfsdf: 'sfsdfdsf', sdfdsf: 34234}).then(res => console.log('res', res));
    // this.auth.createUserWithEmailAndPassword('newnewnew@dsf.dsf', 'sdfsdf').then(user => {
    //   console.log('user', user)
    // });
  }
}
