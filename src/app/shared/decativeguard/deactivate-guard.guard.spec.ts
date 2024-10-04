import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { DeactivateGuardGuard } from './deactivate-guard.guard';

describe('DeactivateGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeactivateGuardGuard]
    });
  });

  it('should ...', inject([DeactivateGuardGuard], (guard: DeactivateGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
