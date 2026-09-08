---
'@seedcord/http': minor
'@seedcord/gateway': patch
---

Halved the drain window to 5000ms for http bots, the same window gateway uses. A handler still running past that keeps going until the process exits.
