import { Component, OnInit } from '@angular/core';
import { FacebookService, InitParams } from 'ngx-facebook';
import { Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

declare var gtag;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'deputies-app';

  constructor(
    fb: FacebookService,
    private router: Router
  ) {
    const navEndEvents$ = this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd)
    );

    navEndEvents$.subscribe((event: NavigationEnd) => {
      gtag('config', 'UA-180301838-1', {
        'page_path': event.urlAfterRedirects
      });
    });
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
