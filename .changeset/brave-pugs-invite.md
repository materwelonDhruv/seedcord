---
'@seedcord/core': patch
---

Fixed a plugin whose `init()` outlasts its timeout. Its `dispose()` now runs when that `init()` resolves, for as long as the process is still alive, so it can release whatever `init()` claimed past the deadline. A late `init()` that rejects now logs a warning.
