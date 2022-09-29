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
        contractAddress: "0x000..1",
        tokenId: "1",
        tokenUri: "https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1"
      },
      {
        name: "Artistic NFT",
        description: "Creativity knows no end",
        image: "https://ipfs.io/ipfs/QmVDeVyDnCmXCFQTbgbc5TW8VGjMtfCVDg7bUhwRhjADNr",
        contractAddress: "0x000..3",
        tokenId: "1",
        tokenUri: "https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1"
      },
      {
        name: "3D Art NFT",
        description: "Art in three dimensions",
        image: "https://ipfs.io/ipfs/QmVDeVyDnCmXCFQTbgbc5TW8VGjMtfCVDg7bUhwRhjADNr",
        contractAddress: "0x000..3",
        tokenId: "3",
        tokenUri: "https://ipfs.io/ipfs/QmVCUAhUNZNhyfnsu9EodNcXsvUf9fxKSSHJEnJrhRBNw1"
      }
    ]);
  }
}
