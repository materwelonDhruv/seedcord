---
'@seedcord/core': minor
---

**BREAKING:** Renamed `routeId` on the gate context to `declaredRoute`, because `ctx.dispatch.routeId` beside it carried a different value under the same name. A gate reading `ctx.routeId` now reads `ctx.declaredRoute`. The bag is unchanged.
