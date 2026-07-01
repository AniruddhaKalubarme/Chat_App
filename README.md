# Chat App

This project uses `socket.io` and a Node server for the live chat experience.

## What requires a server

- Live multi-user chat
- Shared room presence
- Real-time cross-user message delivery

## Local development

```powershell
npm install
npm run start
```

## Render deployment

Deploy the app on Render as a Node web service.

Render will use `render.yaml` with:

```yaml
services:
  - type: web
    name: chat-app
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
```

Connect the GitHub repo in Render and let it deploy automatically.
