import { TestBed } from '@angular/core/testing';

import { SongService } from './song-service.service';

describe('SongServiceService', () => {
  let service: SongService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SongService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
