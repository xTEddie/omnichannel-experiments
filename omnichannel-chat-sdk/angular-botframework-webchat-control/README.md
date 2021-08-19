# Angular-Botframework-Webchat Control

Sample angular app using [Omnichannel Chat SDK](https://github.com/microsoft/omnichannel-chat-sdk) with [BotFramework-WebChat](https://github.com/microsoft/BotFramework-WebChat) as third party web control.

## Scenario Checklist

The sample app includes the following scenarios:

- [x] Start Chat
- [x] End Chat
- [x] Incoming messages
- [x] Incoming image attachments
- [x] Incoming file attachments of other supported formats
- [x] Outgoing messages
- [x] Outgoing file attachments
- [X] Receive typing
- [ ] Send typing
- [ ] Receive agent end session event
- [ ] Download transcript
- [ ] Email transcript
- [ ] Pre-Chat Survey
- [ ] Reconnect existing chat
- [ ] Data masking middleware
- [ ] Attachment middleware
- [ ] Escalation to Voice & Video

## Prerequisites
- [Angular](https://angular.io/)
- [BotFramework-WebChat v4.9.2](https://github.com/microsoft/BotFramework-WebChat)

## Getting Started

### 1. Configure a chat widget

If you haven't set up a chat widget yet. Please follow these instructions on:

https://docs.microsoft.com/en-us/dynamics365/omnichannel/administrator/add-chat-widget

### 2. **Copy** the widget snippet code from the **Code snippet** section and save it somewhere. It will be needed later on.

It should look similar to this:

```html
<script
    id="Microsoft_Omnichannel_LCWidget"
    src="[your-src]"
    data-app-id="[your-app-id]"
    data-org-id="[your-org-id]"
    data-org-url="[your-org-url]"
>
</script>
```

### 3. **Add** your chat widget config to [./src/environments/environment.ts](./src/environments/environment.ts)

```ts
export const environment = {
  production: false,
  omnichannelConfig: {
    orgId: '[your-org-id]',
    orgUrl: '[your-org-url]',
    widgetId: '[your-app-id]'
  }
};

```

### 5. Install the project with `npm ci` and run the application with `ng serve`
