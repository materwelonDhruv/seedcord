---
'@seedcord/core': minor
'@seedcord/types': minor
'@seedcord/errors': minor
---

**BREAKING:** A shutdown that used to run past 25 seconds now stops there and skips the remaining phases. This will probably affect no one.

Added `lifecycle.shutdownDeadline`, a cap on the whole coordinated shutdown, 25000ms by default. A deadline that is zero, negative, or not finite throws `LifecycleInvalidShutdownDeadline`.
