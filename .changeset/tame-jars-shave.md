---
'@seedcord/core': minor
'@seedcord/types': minor
'@seedcord/errors': minor
---

**BREAKING:** A shutdown that used to run more than 25 seconds now stops there and skips the rest. This will most likely affect no one.

Added `lifecycle.shutdownDeadline`, a cap on the whole shutdown, 25000ms by default. A shutdown that interrupts a slow startup waits for that startup out of the same budget. A deadline that is zero, negative, or not finite throws `LifecycleInvalidShutdownDeadline`.
