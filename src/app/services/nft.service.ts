import { Injectable } from '@angular/core';
import { EvmChain } from '@moralisweb3/evm-utils';
import Moralis from 'moralis';
import { from, map, Observable, of, switchMap } from 'rxjs';

import { NFT } from '../models/wallet.model';
import { environment } from './../../environments/environment';
import { WalletService } from './wallet.service';

@Injectable({
  providedIn: 'root',
})
export class NftService {
  constructor(private readonly walletService: WalletService) {
    Moralis.start({
      apiKey: environment.MORALIS_API_KEY,
    });
  }

  /**
   * Loads all NFTs for the connected account
   *
   * @returns Observable list of NFTs
   */
  public loadAccountNfts(): Observable<NFT[]> {
    return this.walletService.account$.pipe(
      switchMap(() => this.loadNfts(this.walletService.account))
    );
  }

  /**
   * Loads all NFTs stored in the Rental Contract
   *
   * @returns Observable list of NFTs
   */
  public loadContractNfts(): Observable<NFT[]> {
    return this.loadNfts(environment.RENTAL_CONTRACT);
  }

  /**
   * Loads all NFTs associated with a specific account address
   *
   * @param address Contains the account address
   * @returns Observable list of NFTs
   */
  private loadNfts(address: string): Observable<NFT[]> {
    return address !== ''
      ? from(
          Moralis.EvmApi.nft.getWalletNFTs({
            address,
            chain: EvmChain.GOERLI,
          })
        ).pipe(
          map((next) => {
            return next.result
              .filter((evmNft) => evmNft != null && evmNft.metadata != null)
              .map((evmNft: any) => {
                const nft = evmNft.toJSON();
                return {
                  tokenAddress: nft.tokenAddress,
                  tokenId: nft.tokenId,
                  name: nft.metadata.name,
                  description: nft.metadata.description,
                  image: this.createIPFSGatewayUrl(nft.metadata.image),
                  ownerAddress: nft.ownerOf,
                };
              });
          })
        )
      : of([]);
  }

  /**
   * Creates the IPFS gateway url to load the image assosiated with an NFT.
   *
   * @param ipfsHash Contains the ipfs hash that is associated with an NFT. This value can have different formats that must be handled.
   * @returns IPFS gateway url
   */
  private createIPFSGatewayUrl(ipfsHash: string): string {
    const url = 'https://ipfs.io/ipfs/';
    const ipfsRegex = /^ipfs?:\/\//;
    const ipfsUrlRegex = /^ipfs?:\/\/ipfs.io\/ipfs\//;
    const httpsIpfsRegex = /^https?:\/\/ipfs.io\/ipfs\//;
    if (ipfsHash.match(ipfsRegex)) {
      return url + ipfsHash.replace(ipfsRegex, '');
    } else if (ipfsHash.match(httpsIpfsRegex)) {
      return url + ipfsHash.replace(httpsIpfsRegex, '');
    } else if (ipfsHash.match(ipfsUrlRegex)) {
      return url + ipfsHash.replace(ipfsUrlRegex, '');
    } else {
      return ipfsHash;
    }
  }
}
