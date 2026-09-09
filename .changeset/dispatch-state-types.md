---
'@seedcord/types': minor
---

Added `DispatchState` and `DispatchBag`. Declare a key on `DispatchState`, then every handler, middleware, gate, and card can read it through `this.dispatch`.
