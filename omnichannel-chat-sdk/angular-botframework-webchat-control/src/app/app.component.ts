import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from './../environments/environment';
import { OmnichannelChatSDK } from '@microsoft/omnichannel-chat-sdk';
import { WebChatControlService } from './web-chat-control.service';
import createCustomStore from './createCustomStore';
import createAvatarMiddleware from './createAvatarMiddleware';
import createActivityMiddleware from './createActivityMiddleware';
import { createDataMaskingMiddleware } from './createDataMaskingMiddleware';

console.log(`%c [OmnichannelConfig]`, 'background-color:#001433;color:#fff');
console.log(environment.omnichannelConfig);
const avatarMiddleware: any = createAvatarMiddleware();
const activityMiddleware: any = createActivityMiddleware();

const styleOptions = {
  bubbleBorderRadius: 10,
  bubbleNubSize: 10,
  bubbleNubOffset: 15,

  bubbleFromUserBorderRadius: 10,
  bubbleFromUserNubSize: 10,
  bubbleFromUserNubOffset: 15,
  bubbleFromUserBackground: 'rgb(246, 246, 246)'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-botframework-webchat-control';
  webChat: any = null;
  chatSDK: OmnichannelChatSDK | null = null;
  chatAdapter: any = null;
  loading: boolean = false;
  hasChatStarted: boolean = false;
  webChatStore: any = null;

  constructor(
    private readonly webChatControlService: WebChatControlService, @Inject(DOCUMENT) private readonly document: any
  ) {}

  async ngOnInit() {
    console.log("[ngOnInit]");

    this.webChatControlService.lazyLoad().subscribe(async (_) => {
      this.webChat = (window as any).WebChat;

      // console.log(this.webChat);

      const chatSDKConfig = {
        telemetry: {
          disable: true
        }
      }

      const chatSDK = new OmnichannelChatSDK(environment.omnichannelConfig, chatSDKConfig);
      // chatSDK.setDebug(true);
      await chatSDK.initialize();

      this.chatSDK = chatSDK;
      this.webChat = (window as any).WebChat;
    });
  }

  async startChat() {
    console.log('[startChat]');

    const dataMaskingRules = await this.chatSDK?.getDataMaskingRules();
    console.log(dataMaskingRules);

    const store = createCustomStore();
    this.webChatStore = store.create();

    store.subscribe('DataMasking', createDataMaskingMiddleware(dataMaskingRules));

    this.hasChatStarted = true;
    this.loading = true;

    await this.chatSDK?.startChat();

    const chatAdapter = await this.chatSDK?.createChatAdapter();
    this.chatAdapter = chatAdapter;

    this.loading = false;

    this.webChat.renderWebChat(
      {
        directLine: chatAdapter,
        sendTypingIndicator: true,
        styleOptions,
        store: this.webChatStore,
        avatarMiddleware,
        activityMiddleware
      },
      this.document.getElementById('chat-container')
    );
  }

  async endChat() {
    console.log('[endChat]');
    await this.chatSDK?.endChat();
    this.hasChatStarted = false;

    // Remove all children
    const parent = this.document.getElementById('chat-container');
    while (parent.firstChild) {
      parent.firstChild.remove()
    }
  }
}
