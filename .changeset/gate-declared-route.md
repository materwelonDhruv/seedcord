---
'@seedcord/core': minor
---

**BREAKING:** Renamed `routeId` on the gate context to `declaredRoute`, because the bag beside it carries a field of the same name, and only the gate context's is null off a route. A gate reading `ctx.routeId` now reads `ctx.declaredRoute`. The bag is unchanged.
