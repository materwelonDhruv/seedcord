---
'@seedcord/core': patch
---

Fixed a plugin whose `init()` outlasts its timeout. Its `dispose()` now runs when that `init()` resolves, so it can close whatever `init()` opened past the deadline. A late `init()` that rejects now logs a warning.
