---
'@seedcord/core': minor
---

**BREAKING:** Renamed `routeId` on `unknownException` and `handledException` to `origin`, because on an event it carries a third segment naming the handler that threw. A subscriber reading `this.data.routeId` now reads `this.data.origin`. `interactionDispatched` and `responseAttempted` keep theirs.
