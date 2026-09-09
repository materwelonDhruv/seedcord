---
'@seedcord/http': minor
'@seedcord/gateway': patch
---

Halved the drain window to 5000ms for http bots, the same window gateway uses. An http shutdown now completes there, where it used to report a failure. Both transports log how many handlers were still running when the window closed.
