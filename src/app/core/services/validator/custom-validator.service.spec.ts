import { TestBed, inject } from '@angular/core/testing';

import { CustomValidatorService } from './custom-validator.service';

describe('CustomValidatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomValidatorService]
    });
  });

  it('should be created', inject([CustomValidatorService], (service: CustomValidatorService) => {
    expect(service).toBeTruthy();
  }));
});
