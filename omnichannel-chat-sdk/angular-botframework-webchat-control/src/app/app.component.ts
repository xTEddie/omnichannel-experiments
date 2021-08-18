import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WebChatControlService } from './web-chat-control.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-botframework-webchat-control';
  webChat: any = null;

  constructor(
    private readonly webChatControlService: WebChatControlService, @Inject(DOCUMENT) private readonly document: any
  ) {}

  async ngOnInit() {
    console.log("[ngOnInit]");

    this.webChatControlService.lazyLoad().subscribe(async (_) => {
      this.webChat = (window as any).WebChat;

      console.log(this.webChat);
    });
  }
}
