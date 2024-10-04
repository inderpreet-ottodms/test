import { TestBed, inject } from '@angular/core/testing';

import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JwtTokenService]
    });
  });

  it('should be created', inject([JwtTokenService], (service: JwtTokenService) => {
    expect(service).toBeTruthy();
  }));
});
