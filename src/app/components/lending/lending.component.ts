import { WalletService } from './../../services/wallet.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lending',
  templateUrl: './lending.component.html',
  styleUrls: ['./lending.component.scss']
})
export class LendingComponent implements OnInit {

  constructor(private readonly walletService: WalletService) { }

  ngOnInit(): void {
  }

}
