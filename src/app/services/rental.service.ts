import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NFT } from '../models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class RentalService {

  constructor() { }

  // TODO: remove mock data
  public getNfts(): Observable<NFT[]> {
    return of([
      {
        name: "Queen Elizabeth NFT",
        description: "Wonderfull portrait of Queen Elizabeth",
        image: "https://ipfs.io/ipfs/QmVDeVyDnCmXCFQTbgbc5TW8VGjMtfCVDg7bUhwRhjADNr",
        contractAddress: "0xAD82da41D7a718ce9F49d33B6A4417C382348503",
        tokenId: "1",
        tokenUri: "https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1"
      },
      {
        name: "Artistic NFT",
        description: "Creativity knows no end",
        image: "https://ipfs.io/ipfs/QmVDeVyDnCmXCFQTbgbc5TW8VGjMtfCVDg7bUhwRhjADNr",
        contractAddress: "0x2312da41D7a718ce9F49d33B631237C38236668",
        tokenId: "1",
        tokenUri: "https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1"
      },
      {
        name: "3D Art NFT",
        description: "Art in three dimensions",
        image: "https://ipfs.io/ipfs/QmVDeVyDnCmXCFQTbgbc5TW8VGjMtfCVDg7bUhwRhjADNr",
        contractAddress: "0xFE4241D7a718ce9F49d33B6A4417C382349753",
        tokenId: "3",
        tokenUri: "https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1"
      }
    ]);
  }
}
