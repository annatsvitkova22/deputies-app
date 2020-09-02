import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'deputies-app';

  constructor(
    private auth: AngularFireAuth
  ){}

  ngOnInit() {
    this.auth.createUserWithEmailAndPassword('newnewnew@dsf.dsf', 'sdfsdf').then(user => {
      console.log('user', user)
    })
  }
}
