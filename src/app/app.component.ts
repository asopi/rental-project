import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable, Subscription } from 'rxjs';

import { LoadingService } from './services/loading.service';
import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  public loading$: Observable<boolean> = this.loadingService.loading$;
  public url$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event: any) => {
      if (event.url === '/showroom') {
        this.sidenav.close();
      }
      return event.url;
    })
  );
  public account$ = this.walletService.account$;

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  private walletSubscription: Subscription;
  private breakPointSubscription!: Subscription;
  constructor(
    private readonly walletService: WalletService,
    private readonly router: Router,
    private readonly breakPointObserver: BreakpointObserver,
    private readonly loadingService: LoadingService
  ) {
    this.walletService.init();
    this.walletSubscription = this.walletService.account$.subscribe((next) => {
      if (next == '') {
        this.walletService.connect();
      }
    });
    this.breakPointSubscription = this.breakPointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((breakpoint) => {
        if (this.sidenav) {
          if (breakpoint.matches) {
            this.sidenav.mode = 'over';
            this.sidenav.close();
          } else {
            this.sidenav.mode = 'side';
            this.sidenav.open();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.walletSubscription?.unsubscribe();
    this.breakPointSubscription?.unsubscribe();
  }

  public openShowroom(): void {
    window.open('/showroom');
  }

  public connect(): void {
    this.walletService.connect();
  }

  public disconnect(): void {
    this.walletService.disconnect();
  }
}
