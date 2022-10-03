import Web3Modal from 'web3modal';
import { Injectable } from '@angular/core';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Subject, tap } from 'rxjs';
import Web3 from 'web3';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  public web3!: Web3;
  private provider: any;
  private accounts!: string[];
  private web3Modal!: Web3Modal;

  private walletSubject = new Subject<any>();
  public address!: string;
  public wallet$ = this.walletSubject.asObservable()
    .pipe(tap(next => this.address = next));

  constructor() { }

  public async connect(): Promise<void> {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: environment.INFURA_ID
        }
      }
    };
    this.web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
      providerOptions,
      theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
      }
    });
    this.web3Modal.clearCachedProvider();

    this.provider = await this.web3Modal.connect();
    this.web3 = new Web3(this.provider);
    this.accounts = await this.web3.eth.getAccounts();
    this.walletSubject.next(this.accounts[0]);
  }

  public async disconnect(): Promise<void> {
    this.web3Modal.clearCachedProvider();
    this.walletSubject.next(null);
  }
}
