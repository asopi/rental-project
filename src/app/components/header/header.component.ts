import { Component } from '@angular/core';

import { WalletService } from './../../services/wallet.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  user$ = this.walletService.wallet$;
  constructor(private readonly walletService: WalletService) { }


  public connect(): void {
    this.walletService.connect();
  }

  public disconnect(): void {
    this.walletService.disconnect();
  }
}
