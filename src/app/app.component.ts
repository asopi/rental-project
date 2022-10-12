import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private walletSubscription!: Subscription;

  constructor(private readonly walletService: WalletService) {
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
