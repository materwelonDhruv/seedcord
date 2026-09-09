---
'@seedcord/gateway': minor
---

**BREAKING:** `@RegisterEventMiddleware` replaces the `Middleware(type, priority, options)` decorator. seedcord now throws at load when two event middleware classes share a name.

Both middleware bases gained an `after()` that runs on every middleware whose `execute()` started, even on a refused dispatch.
