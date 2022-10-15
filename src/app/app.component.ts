import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, map, tap, filter } from 'rxjs';

import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public url$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event: any) => event.url)
  );
  private walletSubscription!: Subscription;
  constructor(
    private readonly walletService: WalletService,
    private readonly router: Router
  ) {
    this.walletService.init();
  }

  ngOnInit() {
    this.walletSubscription = this.walletService.account$.subscribe((next) => {
      if (next == '') {
        this.walletService.connect();
      }
    });
  }

  ngOnDestroy() {
    this.walletSubscription?.unsubscribe();
  }
}
