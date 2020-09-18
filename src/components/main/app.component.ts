import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'deputies-app';

  constructor(
    private authFire: AngularFireAuth,
    private db: AngularFirestore
  ) { }

  async ngOnInit(): Promise<void> {}
}
