# NextJS-Botframework-WebChat Control

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

### 3. **Copy** of [.env.config](.env.config) to [.env.local](.env.local)

```
cp .env.config .env.local
```

Notice [.env.local](.env.local) is in [.gitignore](.gitignore)

### 4. **Add** your chat widget config to [.env.local](.env.local)

```
# Chat Widget Config
NEXT_PUBLIC_orgId='[your-org-id]'
NEXT_PUBLIC_orgUrl='[your-org-url]'
NEXT_PUBLIC_widgetId='[your-app-id]'
```

### 5. Install the project with `yarn install` and run the application with `yarn dev`