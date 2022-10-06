import { Observable } from 'rxjs';
import { Component } from '@angular/core';

import { WalletService } from './../../services/wallet.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public wallet$ = this.walletService.account$;

  constructor(private readonly walletService: WalletService) { }

  public connect(): void {
    this.walletService.connect();
  }

  public disconnect(): void {
    this.walletService.disconnect();
  }
}
