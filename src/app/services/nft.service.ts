import { Injectable } from '@angular/core';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';

import { from, map, Observable, of, switchMap, tap } from 'rxjs';

import { NFT } from '../models/wallet.model';
import { environment } from './../../environments/environment';
import { WalletService } from './wallet.service';
@Injectable({
  providedIn: 'root'
})
export class NftService {

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

  //   {
  //     tokenAddress: string;
  //     chain: string | number;
  //     ownerOf: string | undefined;
  //     blockNumberMinted: string | undefined;
  //     blockNumber: string | undefined;
  //     tokenId: string | number;
  //     contractType?: import("@moralisweb3/evm-utils").EvmNftContractType | undefined;
  //     tokenUri?: string | undefined;
  //     tokenHash?: string | undefined;
  //     metadata?: import("@moralisweb3/core").MoralisDataObjectValue | undefined;
  //     name?: string | undefined;
  //     symbol?: string | undefined;
  //     lastMetadataSync?: Date | undefined;
  //     lastTokenUriSync?: Date | undefined;
  //     amount?: number | undefined;
  // }

  private loadNfts(address: string): Observable<NFT[]> {
    return address !== '' ? from(Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain: EvmChain.GOERLI,
    })).pipe(

      map(next => {
        return next.result.filter(evmNft => evmNft != null).map((evmNft: any) => {
          const nft = evmNft.toJSON();
          return {
            tokenAddress: nft.tokenAddress,
            tokenId: nft.tokenId,
            name: nft.metadata?.name,
            description: nft.metadata?.description,
            image: this.addIPFSProxy(nft.metadata?.image),
            ownerAddress: nft.ownerOf,
          };
        });
      }), tap(next => {
        console.log("next", next);
      })) : of([]);
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
