import { Injectable } from '@angular/core';
import { EvmChain } from '@moralisweb3/evm-utils';
import Moralis from 'moralis';
import { from, map, Observable, of, switchMap } from 'rxjs';

import { NFT } from '../models/wallet.model';
import { environment } from './../../environments/environment';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  constructor(private readonly walletService: WalletService) {
    Moralis.start({
      apiKey: environment.MORALIS_API_KEY,
    });
  }

  public loadAccountNfts(): Observable<NFT[]> {
    return this.walletService.account$.pipe(
      switchMap(account => this.loadNfts(account))
    );
  }

  public loadContractNfts(): Observable<NFT[]> {
    return this.loadNfts(environment.RENTAL_CONTRACT);
  }

  private loadNfts(address: string): Observable<NFT[]> {
    return address !== '' ? from(Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain: EvmChain.GOERLI,
    })).pipe(
      map(next => next.result.map(evmNft => evmNft.metadata)),
      map(next => next.filter(next => next != null)?.map((nft: any) => {
        return {
          name: nft?.name,
          description: nft?.description,
          image: this.addIPFSProxy(nft?.image),
          ownerAddress: address,
        };
      }))
    ) : of([]);
  }

  private addIPFSProxy(ipfsHash: string): string {
    const url = "https://ipfs.io/ipfs/";
    const ipfsRegex = /^ipfs?:\/\//;
    const ipfsUrlRegex = /^ipfs?:\/\/ipfs.io\/ipfs\//;
    const httpsIpfsRegex = /^https?:\/\/ipfs.io\/ipfs\//;

    if (ipfsHash.match(ipfsRegex)) {
      return url + ipfsHash.replace(ipfsRegex, '');
    } else if (ipfsHash.match(httpsIpfsRegex)) {
      return url + ipfsHash.replace(httpsIpfsRegex, '');
    } else if (ipfsHash.match(ipfsUrlRegex)) {
      return url + ipfsHash.replace(ipfsUrlRegex, '');;
    } else {
      return ipfsHash;
    }
  }
}
