import { environment } from './../../environments/environment';

import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { NFT } from '../models/wallet.model';
import { WalletService } from './wallet.service';
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/evm-utils';
@Injectable({
  providedIn: 'root'
})
export class RentalService {

  constructor(private readonly walletService: WalletService) {
  }

  async loadMyNft(): Promise<NFT[]> {
    await Moralis.start({
      apiKey: environment.MORALIS_API_KEY,
    });
    const address = this.walletService.address;
    const chain = EvmChain.ETHEREUM;
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain,
    });
    const nfts = response.result.map(evmNft => evmNft.metadata);
    return nfts.filter(next => next != null).map((next: any) => {
      return {
        name: next?.name,
        description: next?.description,
        image: this.addIPFSProxy(next?.image),
        ownerAddress: address,
      };
    });
  }

  addIPFSProxy(ipfsHash: string) {
    const URL = "https://ipfs.io/ipfs/";
    const ipfsRegex = /^ipfs?:\/\//;
    const httpsIpfsRegex = /^https?:\/\/ipfs.io/;
    let ipfsURL = ipfsHash;
    if (ipfsHash.match(ipfsRegex)) {
      ipfsURL = URL + ipfsHash.replace(ipfsRegex, '');
    } else if (ipfsHash.match(httpsIpfsRegex)) {
      ipfsURL = URL + ipfsHash.replace(httpsIpfsRegex, '');
    }
    return ipfsURL;
  }
}
