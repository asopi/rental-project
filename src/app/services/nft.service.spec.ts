import { TestBed } from '@angular/core/testing';

import { NftService } from './nft.service';

describe('NftServiceTsService', () => {
  let service: NftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
