import { TestBed } from '@angular/core/testing';

import { Insignia } from './insignia';

describe('Insignia', () => {
  let service: Insignia;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Insignia);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
