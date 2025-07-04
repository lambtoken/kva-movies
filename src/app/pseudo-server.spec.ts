import { TestBed } from '@angular/core/testing';

import { PseudoServer } from './pseudo-server';

describe('PseudoServer', () => {
  let service: PseudoServer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PseudoServer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
