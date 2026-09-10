---
'@seedcord/gateway': patch
---

Fixed `eventDispatching` firing without a matching `eventDispatched` once a `frequency: 'once'` handler has run. seedcord published the first key alone on every later message, so a subscriber pairing them leaked an entry each time.
