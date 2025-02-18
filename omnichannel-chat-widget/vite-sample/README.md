# Vite Sample

Sample react app using [omnichannel-chat-widget](https://github.com/microsoft/omnichannel-chat-widget) and [vite](https://vite.dev)

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

### 3. **Copy** of [.env.config](.env.config) to [.env](.env)

```
cp .env.config .env
```

Notice [.env](.env) is in [.gitignore](.gitignore)

### 4. **Add** your chat widget config to [.env](.env)

```
# Chat Widget Config
VITE_ORG_ID='[your-org-id]'
VITE_ORG_URL='[your-org-url]'
VITE_WIDGET_ID='[your-app-id]'
```

### 4. Install the project with `npm ci` and run the application with `npm run start`