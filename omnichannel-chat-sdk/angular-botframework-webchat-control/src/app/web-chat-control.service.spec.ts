import { TestBed } from '@angular/core/testing';

import { WebChatControlService } from './web-chat-control.service';

describe('WebChatControlService', () => {
  let service: WebChatControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebChatControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
