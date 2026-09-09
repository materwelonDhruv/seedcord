---
'@seedcord/core': minor
---

**BREAKING:** every handler constructor now takes a `DispatchContext`.

`@RegisterInteractionMiddleware` registers an interaction middleware and filters it with `{ kinds }`. Middleware, gates, and error cards read one typed bag per dispatch through `this.dispatch`.
