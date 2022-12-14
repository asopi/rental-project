import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import Web3Modal from 'web3modal';

import { abi } from '../../../artifacts/contracts/RentalContract.sol/RentalContract.json';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  public web3!: Web3;
  public rentalContract!: any;
  public account: string = '';
  private provider: any;
  private accounts!: string[];
  private web3Modal!: Web3Modal;

  private walletSubject = new BehaviorSubject<any>(
    sessionStorage.getItem('walletAddress') ?? ''
  );
  public account$ = this.walletSubject
    .asObservable()
    .pipe(map((next) => (this.account = next)));

  public async init(): Promise<boolean> {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: environment.INFURA_ID,
        },
      },
    };
    this.web3Modal = new Web3Modal({
      network: environment.ETHEREUM_NETWORK,
      cacheProvider: true,
      providerOptions,
      theme: {
        background: 'rgb(39, 49, 56)',
        main: 'rgb(199, 199, 199)',
        secondary: 'rgb(136, 136, 136)',
        border: 'rgba(195, 195, 195, 0.14)',
        hover: 'rgb(16, 26, 32)',
      },
    });
    this.provider = await this.web3Modal.connect();
    this.web3 = new Web3(this.provider);
    this.rentalContract = new this.web3.eth.Contract(
      abi as AbiItem[],
      environment.RENTAL_CONTRACT
    );
    return this.web3 != null;
  }

  /**
   * Connects the wallet account stored in MetaMask or WalletConnect and stores it in the session storage.
   */
  public async connect(): Promise<void> {
    this.provider = await this.web3Modal.connect();
    this.web3 = new Web3(this.provider);
    this.accounts = await this.web3.eth.getAccounts();
    const account = this.accounts[0];
    this.walletSubject.next(account);
    sessionStorage.setItem('walletAddress', account);
    window.location.reload();
  }

  /**
   * Disconnects the wallet account stored in MetaMask or WalletConnect and removes it from the session storage.
   */
  public async disconnect(): Promise<void> {
    this.web3Modal.clearCachedProvider();
    this.walletSubject.next('');
    sessionStorage.removeItem('walletAddress');
  }
}
