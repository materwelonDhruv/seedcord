---
'@seedcord/http': minor
'@seedcord/gateway': patch
---

Halved the drain window to 5000ms for http bots, the same window gateway uses. The server stops any handler still running past that.
