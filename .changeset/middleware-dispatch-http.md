---
'@seedcord/http': minor
---

**BREAKING:** every handler constructor now takes a `DispatchContext`.

The node host loads `InteractionMiddleware` from `bot.interactions.middlewares` and runs the chain over the handler's reply surface before its gates. Every middleware that started gets its `after()`, even when a gate refuses the interaction.
