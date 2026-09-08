---
'@seedcord/core': minor
'@seedcord/types': minor
'@seedcord/errors': minor
---

**BREAKING:** A shutdown that used to spend more than 25 seconds in its phases now stops there and skips the rest. This will most likely affect no one.

Added `lifecycle.shutdownDeadline`, a cap on the shutdown phases, 25000ms by default. A deadline that is zero, negative, or not finite throws `LifecycleInvalidShutdownDeadline`.
