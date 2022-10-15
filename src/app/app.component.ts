import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

import { WalletService } from './services/wallet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
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

  private walletSubscription!: Subscription;
  constructor(
    private readonly walletService: WalletService,
    private readonly router: Router,
    private readonly breakPointObserver: BreakpointObserver
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

  ngAfterViewInit() {
    this.breakPointObserver.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
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
