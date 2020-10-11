import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'deputies-app';

  constructor(
    fb: FacebookService
  ) {
    const initParams: InitParams = {
      appId: '334443524450569',
      xfbml: true,
      version: 'v8.0',
      status: true
    };
    fb.init(initParams);
  }

  async ngOnInit(): Promise<void> {
  }
}
