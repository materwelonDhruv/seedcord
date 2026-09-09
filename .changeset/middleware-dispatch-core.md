---
'@seedcord/core': minor
---

**BREAKING:** `@RegisterInteractionMiddleware` replaces the `Middleware(type, priority, options)` decorator. Every handler constructor now takes a `DispatchContext`.

Middleware, gates, and error cards read one typed bag per dispatch through `this.dispatch`.
