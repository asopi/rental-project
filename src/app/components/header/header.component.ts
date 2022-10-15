import { Observable, of } from 'rxjs';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { WalletService } from './../../services/wallet.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input()
  public isMobile = false;

  @Output()
  public connectClicked$: EventEmitter<Event> = new EventEmitter<Event>();

  @Output()
  public disconnectClicked$: EventEmitter<Event> = new EventEmitter<Event>();

  public account$ = this.walletService.account$;

  constructor(private readonly walletService: WalletService) {
    this.walletService.account$;
  }

  public connectClicked(event: Event): void {
    this.connectClicked$.next(event);
  }

  public disconnectClicked(event: Event): void {
    this.disconnectClicked$.next(event);
  }
}
