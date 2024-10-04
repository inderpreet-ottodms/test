import { TestBed, inject } from '@angular/core/testing';

import { QmsService } from './qms.service';

describe('QmsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QmsService]
    });
  });

  it('should be created', inject([QmsService], (service: QmsService) => {
    expect(service).toBeTruthy();
  }));
});
