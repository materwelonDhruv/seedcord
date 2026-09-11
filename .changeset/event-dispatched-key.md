---
'@seedcord/gateway': minor
'@seedcord/core': minor
---

Added `eventDispatched`, which fires once an event's handlers settle and carries the class name and outcome of each one. An event used to report only that it started, so a handler that failed showed up nowhere. A fire that runs no handler stays quiet, matching `eventDispatching`.
