import { TestBed } from '@angular/core/testing';

import { ConnectHTTPService } from './connect-http.service';

describe('ConnectHTTPService', () => {
  let service: ConnectHTTPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectHTTPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
