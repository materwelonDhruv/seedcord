---
'@seedcord/core': minor
'@seedcord/types': minor
---

Added `lifecycle.shutdownDeadline`, a cap on how long the whole coordinated shutdown may take. Each task's timeout clamps to what the budget has left, so a phase that overruns leaves less for the teardowns after it. It defaults to 25000ms, which means a shutdown that used to run longer now stops there.
