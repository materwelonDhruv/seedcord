---
'@seedcord/errors': minor
---

**BREAKING:** `SeedcordErrorCode.InteractionDuplicateMiddleware` is now `DuplicateMiddleware`, since event middleware throws it too. Dropping `DecoratorInteractionEventFilter` renumbered the five `Decorator*` codes after it.

Added `DispatchStateMissing` for a `dispatch.require()` key that nothing wrote.
