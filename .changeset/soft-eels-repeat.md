---
'@seedcord/http': minor
'@seedcord/gateway': patch
---

Halved the drain window to 5000ms for http bots, matching gateway. A handler still in flight past that stops when the server does.
