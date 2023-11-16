import { TestBed } from '@angular/core/testing';

import { ByteService } from './byte.service';

describe('ByteService', () => {
  let service: ByteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ByteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
