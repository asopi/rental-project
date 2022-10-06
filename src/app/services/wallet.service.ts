import Web3Modal from 'web3modal';
import { Injectable } from '@angular/core';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { BehaviorSubject } from 'rxjs';
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

  private walletSubject = new BehaviorSubject<any>(sessionStorage.getItem("walletAddress") ?? '');
  public account$ = this.walletSubject.asObservable();

  constructor() { }

  public async init(): Promise<void> {
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
  }

  public async connect(): Promise<void> {
    this.provider = await this.web3Modal.connect();
    this.web3 = new Web3(this.provider);
    this.accounts = await this.web3.eth.getAccounts();
    const account = this.accounts[0];
    this.walletSubject.next(account);
    sessionStorage.setItem("walletAddress", account);
  }

  public async disconnect(): Promise<void> {
    this.web3Modal.clearCachedProvider();
    this.walletSubject.next('');
    sessionStorage.removeItem("walletAddress");
  }
}
