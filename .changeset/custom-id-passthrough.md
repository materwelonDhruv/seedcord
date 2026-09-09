---
'@seedcord/core': patch
'@seedcord/gateway': patch
'@seedcord/http': patch
---

The transport packages now export `prefixOf`, `decodeFor`, and the custom-id types. Reading a raw customId no longer needs `@seedcord/custom-id` as a direct dependency.
