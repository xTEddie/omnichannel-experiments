# Cordova-Angular-Botframework-Webchat Control

## Prerequisites

1. [Android](https://www.android.com/)
1. [iOS](https://developer.apple.com/ios/)
1. [Cordova](https://cordova.apache.org/#getstarted)
1. [angular-botframework-webchat-control](../angular-botframework-webchat-control/)

## Getting Started

### 1. Follow instructions on [angular-botframework-webchat-control](../angular-botframework-webchat-control/)

### 2. Build [angular-botframework-webchat-control](../angular-botframework-webchat-control/) project

```sh
npm run build
```

### 3. Update `angular-botframework-webchat-control/dist/index.html`

```diff
-<base href="/">
+<base href="./">
```

### 4 Add `android` platform

```sh
cordova platforms add android
```

### 5. Remove `www/` folder

```sh
rm -rf www/
```

### 6. Copy  `angular-botframework-webchat-control/dist/angular-botframework-webchat-control` folder to `cordova-angular-botframework-webchat-control/www`

```
mkdir www
cp -r ../angular-botframework-webchat-control/dist/angular-botframework-webchat-control www/
```

### 7. Run app

```
cordova emulate android
```