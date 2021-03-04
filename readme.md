# PWA Introduction
- We will build a webapp which keeps track of some tasks related to office work.

### Basic app setup
- A Basic app is created without thinking about pwa from start, since there are lot of web apps running already which needs to be converted to pwa.
- The Basic app uses bootstrap and alphine.js
- Alphine is similar to modern frontend framework in building frontend components, except the code is written in the dom itself instead of a separate file.
- Data is fetched from data.json file using `fetch` api.

### Basic needs of PWA
- Serve files in HTTPS (localhost is good to go).
- `manifest.json` file contains the information about the application.
- `serviceworker.js` - to create a service worker which will be used to cache files, push notifications, etc.
- Create a report with Lighthouse from any chromium based browser to check the performance and pwa aspects of the website.
- In the report we can notice the requirements of a pwa.

### Service Worker
- It is an event driven javascript file.
- Hook some events and do something when the event occurs.
- First we need to register the service worker in `app.js` (main js) file.
- 