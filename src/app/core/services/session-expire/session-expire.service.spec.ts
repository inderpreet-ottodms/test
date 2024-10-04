import { TestBed, inject } from '@angular/core/testing';

import { SessionExpireService } from './session-expire.service';

describe('SessionExpireService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionExpireService]
    });
  });

  it('should be created', inject([SessionExpireService], (service: SessionExpireService) => {
    expect(service).toBeTruthy();
  }));
});
